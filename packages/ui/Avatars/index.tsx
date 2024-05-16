import Avatar from "boring-avatars";
import Image from "next/image";

// const colors = ["#00C4B8", "#ccfbf1", "#334155"];
const colors = ["#7b4cfa", "#d5ff66"];

interface PersonAvatarProps {
  personId: string;
  size?: number;
}

export const PersonAvatar: React.FC<PersonAvatarProps> = ({ personId, size = 40 }) => {
  return <Avatar size={size} name={personId} variant="beam" colors={colors} />;
};

interface ProfileAvatarProps {
  userId: string;
  size?: number;
  imageUrl?: string | null;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ userId, imageUrl, size = 40 }) => {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        width="40"
        height="40"
        className="h-10 w-10 rounded-full object-cover"
        alt="Avatar placeholder"
      />
    );
  }
  return <Avatar size={size} name={userId} variant="pixel" colors={colors} />;
};
