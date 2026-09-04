// partnerPreferenceApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface PartnerAgeRange {
  minAge: number;
  maxAge: number;
}

export interface PartnerHeightRange {
  minHeight: string;
  maxHeight: string;
}

export interface PartnerMaritalStatus {
  preferences: string[];
}

export interface PartnerBasicDetails {
  age: PartnerAgeRange;
  height: PartnerHeightRange;
  partnerCountry: string[];
  partnerState: string[];
  partnerCity: string[];
  maritalStatus: PartnerMaritalStatus;
}

export interface PartnerOccupation {
  doesntMatter: boolean;
  preferences: string[];
}

export interface PartnerEducationDetails {
  doesntMatter: boolean;
  highestDegrees: string[];
  wellKnownColleges: string;
  occupation: PartnerOccupation;
  annualIncome: string;
}

export interface PartnerFamilyBasedOutOfCountry {
  country: string;
}

export interface PartnerFamilyDetails {
  familyBasedOutOfCountry: PartnerFamilyBasedOutOfCountry;
}

export interface PartnerReligionPreference {
  preference: string;
}

export interface PartnerCastePreference {
  preferences: string[];
}

export interface PartnerManglikStatus {
  preferences: string[];
}

export interface PartnerReligionAndEthnicity {
  religion: PartnerReligionPreference;
  caste: PartnerCastePreference;
  subCaste: PartnerCastePreference;
  motherTongue: PartnerReligionPreference;
  manglikStatus: PartnerManglikStatus;
}

export interface PartnerPreferenceList {
  preferences: string[];
}

export interface PartnerLifestyleAndAppearance {
  dietaryHabits: PartnerPreferenceList;
  smokingHabits: PartnerPreferenceList;
  drinkingHabits: PartnerPreferenceList;
  disability: PartnerPreferenceList;
}

export interface AboutMyPartner {
  description: string;
}

export interface PartnerPreferencePayload {
  basicDetails: PartnerBasicDetails;
  educationDetails: PartnerEducationDetails;
  familyDetails: PartnerFamilyDetails;
  religionAndEthnicity: PartnerReligionAndEthnicity;
  lifestyleAndAppearance: PartnerLifestyleAndAppearance;
  aboutMyPartner: AboutMyPartner;
  createdBy: string;
}

export interface PartnerPreference {
  _id: string;
  profileId: Record<string, unknown> | string;
  basicDetails?: Partial<PartnerBasicDetails> | Record<string, never>;
  educationDetails?: Partial<PartnerEducationDetails> | Record<string, never>;
  familyDetails?: Partial<PartnerFamilyDetails> | Record<string, never>;
  religionAndEthnicity?:
    | Partial<PartnerReligionAndEthnicity>
    | Record<string, never>;
  lifestyleAndAppearance?:
    | Partial<PartnerLifestyleAndAppearance>
    | Record<string, never>;
  aboutMyPartner?: Partial<AboutMyPartner> | Record<string, never>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerPreferenceResponse {
  success: boolean;
  message?: string;
  data: PartnerPreference;
}

export interface ResetSectionResponse {
  success: boolean;
  message?: string;
  data: Record<string, never>;
}

// Section names accepted by PATCH /v1/api/partner-preference/reset/{section}
export type PartnerPreferenceSection =
  | "basicDetails"
  | "educationDetails"
  | "familyDetails"
  | "religionAndEthnicity"
  | "lifestyleAndAppearance"
  | "aboutMyPartner";

export const partnerPreferenceApi = createApi({
  reducerPath: "partnerPreferenceApi",
  tagTypes: ["PartnerPreference"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    savePartnerPreference: builder.mutation<
      PartnerPreferenceResponse,
      PartnerPreferencePayload
    >({
      query: (body) => ({
        url: "/partner-preference",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PartnerPreference"],
    }),

    getPartnerPreference: builder.query<PartnerPreferenceResponse, void>({
      query: () => "/partner-preference",
      providesTags: ["PartnerPreference"],
    }),

    resetPartnerPreferenceSection: builder.mutation<
      ResetSectionResponse,
      PartnerPreferenceSection
    >({
      query: (section) => ({
        url: `/partner-preference/reset/${section}`,
        method: "PATCH",
      }),
      invalidatesTags: ["PartnerPreference"],
    }),
  }),
});

export const {
  useSavePartnerPreferenceMutation,
  useGetPartnerPreferenceQuery,
  useResetPartnerPreferenceSectionMutation,
} = partnerPreferenceApi;
