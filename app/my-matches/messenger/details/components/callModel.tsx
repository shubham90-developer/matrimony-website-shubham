"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetCallTokenMutation,
  useUpdateCallMutation,
} from "@/Redux/callApi";

interface CallModalProps {
  receiverId: string;
  receiverName: string;
  onClose: () => void;
}

const CallModal = ({ receiverId, receiverName, onClose }: CallModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"connecting" | "in-call" | "blocked">(
    "connecting",
  );
  const callIdRef = useRef<string>(crypto.randomUUID());
  const startedAtRef = useRef<number>(0);

  const [getCallToken] = useGetCallTokenMutation();
  const [updateCall] = useUpdateCallMutation();

  useEffect(() => {
    let zegoInstance: any = null;
    let cancelled = false;

    const start = async () => {
      const tokenResult = await getCallToken({
        receiverId,
        callType: "voice",
      });

      if (cancelled) return;

      if ("error" in tokenResult) {
        const err: any = tokenResult.error;
        const message =
          err?.data?.message ?? "Could not start the call. Please try again.";
        toast.error(message);
        setStatus("blocked");
        onClose();
        return;
      }

      const { token, appId, roomId, userId } = tokenResult.data.data;

      // Log the call as started (mirrors call.service.ts's Firestore
      // "calls" collection + chat preview update).
      await updateCall({
        callId: callIdRef.current,
        senderId: userId,
        receiverId,
        callType: "voice",
        status: "ringing",
      });

      startedAtRef.current = Date.now();

      // Dynamic import keeps this SDK out of the main bundle until a
      // call is actually started.
      const { ZegoUIKitPrebuilt } =
        await import("@zegocloud/zego-uikit-prebuilt");

      if (!containerRef.current || cancelled) return;

      zegoInstance = ZegoUIKitPrebuilt.create(token);

      zegoInstance.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: false,
        showMyCameraToggleButton: false,
        showAudioVideoSettingsButton: false,
        showScreenSharingButton: false,
        onLeaveRoom: () => {
          const durationSeconds = Math.round(
            (Date.now() - startedAtRef.current) / 1000,
          );

          updateCall({
            callId: callIdRef.current,
            senderId: userId,
            receiverId,
            callType: "voice",
            status: "ended",
            duration: durationSeconds,
            endedBy: userId,
          });

          onClose();
        },
      });

      setStatus("in-call");
    };

    start();

    return () => {
      cancelled = true;
      zegoInstance?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiverId]);

  if (status === "blocked") return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
      <div className="relative h-[80vh] w-[92vw] max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-stone-600 hover:bg-white"
          aria-label="Close call"
        >
          <X size={18} />
        </button>

        {status === "connecting" && (
          <div className="flex h-full w-full items-center justify-center text-sm text-stone-500">
            Calling {receiverName}…
          </div>
        )}

        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
};

export default CallModal;
