import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  adultCount: number;
  childCount: number;
};

type Props = {
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading }: Props) => {
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit } = formMethods;

  const onSubmit = handleSubmit((FormValue: HotelFormData) => {
    const formData = new FormData();
    formData.append("name", FormValue.name);
    formData.append("city", FormValue.city);
    formData.append("country", FormValue.country);
    formData.append("description", FormValue.description);
    formData.append("type", FormValue.type);
    formData.append("pricePerNight", FormValue.pricePerNight.toString());
    formData.append("starRating", FormValue.starRating.toString());
    formData.append("adultCount", FormValue.adultCount.toString());
    formData.append("childCount", FormValue.childCount.toString());

    FormValue.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    Array.from(FormValue.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    onSave(formData);
    console.log(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />
        <span className="flex justify-end ">
          <button
            disabled={isLoading}
            type="submit"
            className="disabled:bg-gray-500 bg-blue-600 text-white p-2 font-bold hove:bg-blue-500 text-xl"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
