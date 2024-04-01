import Avatar from "boring-avatars";

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
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ userId, size = 40 }) => {
  return <Avatar size={size} name={userId} variant="pixel" colors={colors} />;
};
