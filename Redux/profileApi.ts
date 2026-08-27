// profileApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface BasicDetails {
  profileFor: string;
  gender: string;
  firstName: string;
  lastName: string;
  dob: string;
  age: number;
  height: string;
  maritalStatus: string;
}

export interface EducationDetails {
  highestQualification: string;
  educationType: string;
  occupation: string;
  annualIncome: string;
}

export interface ReligionDetails {
  religion: string;
  caste: string;
  subCaste: string;
  hasDosh: boolean;
  motherTongue: string;
}

export interface LocationDetails {
  country: string;
  state: string;
  city: string;
}

export interface AdditionalDetails {
  classType: string;
  brothers: string;
  marriedBrothers: string;
  sisters: string;
  marriedSisters: string;
  livingWithFamily: boolean;
  familyLocation: string;
}

export interface BirthTime {
  hour: number;
  minute: number;
  meridiem: string;
}

export interface StarDetails {
  nakshatra: string;
  rashi: string;
}

export interface HoroscopeDetails {
  birthTime: BirthTime;
  birthPlace: LocationDetails;
  starDetails: StarDetails;
}

export interface LifestyleDetailsBasic {
  eatingHabit: string;
}

export interface CareerDetails {
  employedIn: string;
  occupation: string;
  organizationName: string;
  interestedInSettlingAbroad: boolean;
}

export interface Education {
  aboutEducation: string;
  highestDegree: string;
  postGraduation: string;
  underGraduation: string;
  school: string;
}

export interface Family {
  aboutFamily: string;
  fatherOccupation: string;
  motherOccupation: string;
  brothers: string;
  sisters: string;
  familyIncome: string;
  familyStatus: string;
  familyType: string;
  familyValue: string;
  livingWithParents: boolean;
  familyBasedOutOf: string;
}

export interface ContactDetails {
  email: string;
  alternateEmail: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  landlineNumber: string;
  relationshipWithBrideOrGroom: string;
}

export interface Lifestyle {
  dietaryHabit: string;
  drinkingHabit: string;
  smokingHabit: string;
  openToPets: boolean;
  ownHouse: boolean;
  ownCar: boolean;
  foodICook: string;
  hobbies: string[];
  favouriteMusic: string[];
  favouriteBooks: string[];
  dressStyle: string;
  sports: string[];
  cuisine: string[];
  movies: string[];
  favouriteRead: string[];
  tvShow: string[];
}

export interface AboutMe {
  about: string;
  describeYourself: string;
  profileCreatedBy: string;
  languagesISpeak: string[];
  disability: string;
  thalassemia: string;
  hivStatus: boolean;
}

// ---------- Payload for POST /v1/api/profile ----------
// Plain JSON — no photos, no subscription. Photos are uploaded separately
// (POST /v1/api/profile/photos) AFTER this profile exists; subscription is
// server-managed and only set once a package is purchased.
export interface ProfilePayload {
  basicDetails: BasicDetails;
  educationDetails: EducationDetails;
  religionDetails: ReligionDetails;
  locationDetails: LocationDetails;
  additionalDetails: AdditionalDetails;
  horoscopeDetails: HoroscopeDetails;
  lifestyleDetails: LifestyleDetailsBasic;
  careerDetails: CareerDetails;
  education: Education;
  family: Family;
  contactDetails: ContactDetails;
  lifestyle: Lifestyle;
  aboutMe: AboutMe;
}

export interface Profile extends ProfilePayload {
  _id: string;
  userId: string;
  matrimonyId: string;
  photos: string[];
  subscription: {
    isActive: boolean;
    packageId?: string;
    startDate?: string;
    expiryDate?: string;
  };
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  message?: string;
  data: Profile;
}

// ---------- Base URL ----------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}

// ---------- API slice ----------
export const profileApi = createApi({
  reducerPath: "profileApi",

  tagTypes: ["Profile"],
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // STEP 1 — create the profile itself (plain JSON, no photos).
    addProfile: builder.mutation<ProfileResponse, ProfilePayload>({
      query: (body) => ({
        url: "/profile",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    uploadProfilePhotos: builder.mutation<ProfileResponse, File[]>({
      query: (photos) => {
        const formData = new FormData();
        photos.forEach((file) => formData.append("photos", file));
        return {
          url: "/profile/photos",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),

    getMyProfile: builder.query<ProfileResponse, void>({
      query: () => "/profile/me",
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation<ProfileResponse, Partial<ProfilePayload>>({
      query: (body) => ({
        url: "/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    // SOFT DELETE — PATCH /v1/api/profile.
    deleteProfile: builder.mutation<ProfileResponse, void>({
      query: () => ({
        url: "/profile",
        method: "PATCH",
      }),
      invalidatesTags: ["Profile"],
    }),

    removeProfilePhoto: builder.mutation<ProfileResponse, string>({
      query: (photoUrl) => ({
        url: "/profile/remove-photo",
        method: "DELETE",
        body: { photoUrl },
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useAddProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useUploadProfilePhotosMutation,
  useGetMyProfileQuery,
  useRemoveProfilePhotoMutation,
} = profileApi;
