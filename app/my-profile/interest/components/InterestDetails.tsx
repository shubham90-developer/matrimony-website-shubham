"use client";

import ThemeBtnOne from "@/app/components/ThemeBtnOne";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} from "@/Redux/profileApi";
import { useGetMotherTonguesQuery } from "@/Redux/motherToungeApi";

// ---------- multi-select group (true array backend fields) ----------
type OptionGroupProps = {
  title: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
};

const OptionGroup = ({ title, options, value, onChange }: OptionGroupProps) => {
  const toggleOption = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div>
      <h2 className="mb-3 text-md font-bold text-slate-900">{title}</h2>

      <div className="flex flex-wrap gap-3">
        {options.map((item) => {
          const selected = value.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => toggleOption(item)}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition cursor-pointer ${
                selected
                  ? "border-rose-400 bg-rose-50 text-rose-600"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ---------- single-select group (backend stores these as one string) ----------
type SingleOptionGroupProps = {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const SingleOptionGroup = ({
  title,
  options,
  value,
  onChange,
}: SingleOptionGroupProps) => {
  return (
    <div>
      <h2 className="mb-3 text-md font-bold text-slate-900">{title}</h2>

      <div className="flex flex-wrap gap-3">
        {options.map((item) => {
          const selected = value === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(selected ? "" : item)}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition cursor-pointer ${
                selected
                  ? "border-rose-400 bg-rose-50 text-rose-600"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const InterestDetails = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const { data: motherTongueRes } = useGetMotherTonguesQuery();

  // single-string backend fields
  const [eatingHabit, setEatingHabit] = useState("");
  const [smokingHabit, setSmokingHabit] = useState("");
  const [drinkingHabit, setDrinkingHabit] = useState("");
  const [cook, setCook] = useState("");
  const [dress, setDress] = useState("");

  // true array backend fields
  const [assets, setAssets] = useState<string[]>([]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [language, setLanguage] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState<string[]>([]);
  const [music, setMusic] = useState<string[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [read, setRead] = useState<string[]>([]);
  const [book, setBook] = useState<string[]>([]);
  const [movies, setMovies] = useState<string[]>([]);
  const [TvShow, setTvShow] = useState<string[]>([]);

  // no backend field for these two yet — local only
  const [intrest, setIntrest] = useState<string[]>([]);
  const [destination, setDestination] = useState<string[]>([]);

  // ---------- pre-fill once profile loads ----------
  useEffect(() => {
    if (!data?.data) return;
    const p = data.data;
    const l = p.lifestyle;
    const a = p.aboutMe;

    setEatingHabit(l?.dietaryHabit || "");
    setSmokingHabit(l?.smokingHabit || "");
    setDrinkingHabit(l?.drinkingHabit || "");
    setCook(l?.foodICook || "");
    setDress(l?.dressStyle || "");

    setAssets([
      ...(l?.ownHouse ? ["Own House"] : []),
      ...(l?.ownCar ? ["Own Car"] : []),
    ]);
    setHobbies(l?.hobbies || []);
    setLanguage(a?.languagesISpeak || []);
    setCuisine(l?.cuisine || []);
    setMusic(l?.favouriteMusic || []);
    setSports(l?.sports || []);
    setRead(l?.favouriteRead || []);
    setBook(l?.favouriteBooks || []);
    setMovies(l?.movies || []);
    setTvShow(l?.tvShow || []);
  }, [data]);

  const handleUpdate = async () => {
    if (!data?.data) return;
    const existing = data.data;

    try {
      await updateProfile({
        lifestyle: {
          ...(existing.lifestyle || {}),
          dietaryHabit: eatingHabit,
          smokingHabit,
          drinkingHabit,
          openToPets: existing.lifestyle?.openToPets ?? false,
          ownHouse: assets.includes("Own House"),
          ownCar: assets.includes("Own Car"),
          foodICook: cook,
          hobbies,
          favouriteMusic: music,
          favouriteBooks: book,
          dressStyle: dress,
          sports,
          cuisine,
          movies,
          favouriteRead: read,
          tvShow: TvShow,
        },
        aboutMe: {
          ...(existing.aboutMe || {}),
          languagesISpeak: language,
        },
      }).unwrap();
      toast.success("Profile updated successfully");
      router.push("/my-profile");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">Loading...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-sm text-rose-500">
        Could not load profile.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="relative mb-4 flex items-center justify-center border-b border-dashed border-gray-200 py-3">
          <Link
            href="/my-profile"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </Link>
          <h3 className="font-serif text-xl font-semibold text-slate-900">
            My Lifestyle & Interests
          </h3>
        </div>
        <div>
          <div className="space-y-4 mb-10 ">
            <div className="space-y-8 mb-8">
              <SingleOptionGroup
                title="Eating Habit"
                options={["Vegetarian", "Non Vegetarian", "Eggitarian"]}
                value={eatingHabit}
                onChange={setEatingHabit}
              />

              <SingleOptionGroup
                title="Smoking Habit"
                options={["Never", "Occasionally", "Regularly"]}
                value={smokingHabit}
                onChange={setSmokingHabit}
              />

              <SingleOptionGroup
                title="Drinking Habit"
                options={["Never", "Occasionally", "Socially", "Regularly"]}
                value={drinkingHabit}
                onChange={setDrinkingHabit}
              />
              <OptionGroup
                title="Assets"
                options={["Own House", "Own Car"]}
                value={assets}
                onChange={setAssets}
              />

              <OptionGroup
                title="Hobbies"
                options={[
                  "Painting",
                  "Singing",
                  "Dancing",
                  "Cooking",
                  "Reading",
                  "Writing",
                  "Traveling",
                  "Photography",
                  "Gardening",
                  "Music",
                  "Playing Guitar",
                  "Playing Piano",
                  "Playing Violin",
                  "Swimming",
                  "Cycling",
                  "Running",
                  "Walking",
                  "Yoga",
                  "Meditation",
                  "Gym",
                  "Cricket",
                  "Football",
                  "Badminton",
                  "Tennis",
                  "Chess",
                  "Carrom",
                  "Volleyball",
                  "Basketball",
                  "Table Tennis",
                  "Hiking",
                  "Camping",
                  "Fishing",
                  "Drawing",
                  "Sketching",
                  "Crafting",
                  "Knitting",
                  "Embroidery",
                  "Blogging",
                  "Vlogging",
                  "Gaming",
                  "Coding",
                  "Watching Movies",
                  "Watching TV Shows",
                  "Listening to Music",
                  "Collecting Coins",
                  "Collecting Stamps",
                  "Pet Care",
                  "Fashion",
                  "Shopping",
                  "Interior Decoration",
                  "Baking",
                  "Food Exploring",
                  "Social Work",
                  "Volunteering",
                  "Public Speaking",
                  "Poetry",
                  "Calligraphy",
                  "Astrology",
                  "Spiritual Activities",
                  "Nature Walks",
                  "Bird Watching",
                  "Adventure Sports",
                  "Driving",
                  "Bike Riding",
                  "DIY Projects",
                  "Learning Languages",
                  "Stock Market",
                  "Investing",
                  "Podcast Listening",
                  "Puzzle Solving",
                  "Sudoku",
                  "Origami",
                ]}
                value={hobbies}
                onChange={setHobbies}
              />

              {/* <OptionGroup
                title="Interest"
                options={[
                  "Traveling",
                  "Reading",
                  "Writing",
                  "Photography",
                  "Cooking",
                  "Gardening",
                  "Music",
                  "Dancing",
                  "Singing",
                  "Painting",
                  "Drawing",
                  "Gaming",
                  "Coding",
                  "Fitness",
                  "Yoga",
                  "Meditation",
                  "Shopping",
                  "Watching Movies",
                  "Social Work",
                  "Adventure Sports",
                ]}
                value={intrest}
                onChange={setIntrest}
              /> */}

              <OptionGroup
                title="Languages"
                options={motherTongueRes?.data.map((m) => m.motherTongue) || []}
                value={language}
                onChange={setLanguage}
              />

              <SingleOptionGroup
                title="Cooking"
                options={[
                  "Excellent",
                  "Good",
                  "Average",
                  "Basic",
                  "Learning",
                  "Don't Know",
                ]}
                value={cook}
                onChange={setCook}
              />

              <OptionGroup
                title="Favorite Cuisine"
                options={[
                  "North Indian",
                  "South Indian",
                  "Maharashtrian",
                  "Gujarati",
                  "Punjabi",
                  "Rajasthani",
                  "Chinese",
                  "Italian",
                  "Mexican",
                  "Thai",
                  "Continental",
                  "Street Food",
                ]}
                value={cuisine}
                onChange={setCuisine}
              />

              <OptionGroup
                title="Music"
                options={[
                  "Bollywood",
                  "Classical",
                  "Bhajans",
                  "Marathi",
                  "Punjabi",
                  "Pop",
                  "Rock",
                  "Jazz",
                  "Hip Hop",
                  "Romantic",
                  "Instrumental",
                  "Devotional",
                ]}
                value={music}
                onChange={setMusic}
              />

              <SingleOptionGroup
                title="Dress Style"
                options={[
                  "Traditional",
                  "Western",
                  "Casual",
                  "Formal",
                  "Ethnic",
                  "Fusion",
                ]}
                value={dress}
                onChange={setDress}
              />

              <OptionGroup
                title="Sports"
                options={[
                  "Cricket",
                  "Football",
                  "Badminton",
                  "Tennis",
                  "Basketball",
                  "Volleyball",
                  "Swimming",
                  "Cycling",
                  "Running",
                  "Gym",
                  "Yoga",
                  "Chess",
                ]}
                value={sports}
                onChange={setSports}
              />

              <OptionGroup
                title="Reading Habit"
                options={["Daily", "Weekly", "Occasionally", "Rarely", "Never"]}
                value={read}
                onChange={setRead}
              />

              <OptionGroup
                title="Favorite Book Genre"
                options={[
                  "Fiction",
                  "Non-Fiction",
                  "Biography",
                  "History",
                  "Spiritual",
                  "Self Help",
                  "Business",
                  "Science",
                  "Technology",
                  "Romance",
                  "Mystery",
                  "Comics",
                ]}
                value={book}
                onChange={setBook}
              />

              <OptionGroup
                title="Favorite Movies"
                options={[
                  "Action",
                  "Comedy",
                  "Drama",
                  "Romantic",
                  "Thriller",
                  "Horror",
                  "Sci-Fi",
                  "Animation",
                  "Documentary",
                  "Family",
                ]}
                value={movies}
                onChange={setMovies}
              />

              <OptionGroup
                title="Favorite TV Shows"
                options={[
                  "Comedy",
                  "Drama",
                  "Reality Shows",
                  "News",
                  "Sports",
                  "Web Series",
                  "Crime",
                  "Documentary",
                  "Mythological",
                  "Cartoons",
                ]}
                value={TvShow}
                onChange={setTvShow}
              />

              {/* <OptionGroup
                title="Dream Destination"
                options={[
                  "Goa",
                  "Kashmir",
                  "Kerala",
                  "Ladakh",
                  "Manali",
                  "Dubai",
                  "Singapore",
                  "Thailand",
                  "Maldives",
                  "Switzerland",
                  "Paris",
                  "London",
                  "Japan",
                  "Bali",
                  "New Zealand",
                ]}
                value={destination}
                onChange={setDestination}
              /> */}
            </div>
          </div>
          <div className="flex justify-end">
            <ThemeBtnOne
              text={isSaving ? "Updating..." : "Update"}
              disabled={isSaving}
              onClick={handleUpdate}
              className="mt-4 bg-rose-500 text-white px-3 py-2 font-serif rounded-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default InterestDetails;
