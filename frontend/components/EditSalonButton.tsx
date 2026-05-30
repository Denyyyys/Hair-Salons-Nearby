import { useRouter } from "next/navigation";
import axios from "axios";
import { getValidToken } from "@/auth";
import { tryEditSalon } from "@/api/salons";
import { type SalonDetails } from "@/types/salon";

type Props = {
    salon: SalonDetails;
};

export default function EditSalonButton({ salon }: Props) {
    const router = useRouter();

    const handleEditClick = async () => {
        const token = getValidToken();
        if (!token) {
            alert("You are not logged in.");
            return;
        }

        try {
            await tryEditSalon(salon.booksyBusinessId, token, {
                address: salon.address,
                description: salon.description,
                district: salon.district,
                email: salon.email,
                facebookLink: salon.facebookLink,
                instagramLink: salon.instagramLink,
                name: salon.name,
                phone: salon.phone,
                services: salon.services,
            });

            router.push(`/salons/${salon.booksyBusinessId}/edit`);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                alert("You are not allowed to change this record.");
                return;
            }

            alert("Something went wrong.");
        }
    };

    return (
        <button
            type="button"
            onClick={handleEditClick}
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
            Edit salon
        </button>
    );
}