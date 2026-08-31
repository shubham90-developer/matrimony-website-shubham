// profileApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
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

export interface ProfileFeedParams {
  matchPreference?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  [key: string]: string | number | undefined;
}

export interface ProfileFeedListResponse {
  success: boolean;
  count: number;
  data: Profile[];
}

export interface RecommendedMatchesParams {
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}

const buildQueryString = (
  params?: Record<string, string | number | undefined>,
) => {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};

export const profileApi = createApi({
  reducerPath: "profileApi",

  tagTypes: ["Profile"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
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

    getProfileFeed: builder.query<
      ProfileFeedListResponse,
      ProfileFeedParams | void
    >({
      query: (params) => `/profile${buildQueryString(params ?? undefined)}`,
      providesTags: ["Profile"],
    }),

    getRecommendedMatches: builder.query<
      ProfileFeedListResponse,
      RecommendedMatchesParams | void
    >({
      query: (params) =>
        `/profile/recommended-matches${buildQueryString(params ?? undefined)}`,
      providesTags: ["Profile"],
    }),

    getProfileById: builder.query<ProfileResponse, string>({
      query: (id) => `/profile/${id}`,
      providesTags: (result, error, id) => [{ type: "Profile", id }],
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
  useGetProfileFeedQuery,
  useGetRecommendedMatchesQuery,
  useGetProfileByIdQuery,
} = profileApi;
