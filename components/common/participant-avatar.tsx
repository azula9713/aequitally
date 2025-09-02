import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/helpers/common.helper";
// import { Participant } from "@/lib/types/tally";

type ParticipantAvatarProps = { participant: any; className?: string };

export function ParticipantAvatar({
  participant,
  className
}: ParticipantAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarFallback className="text-xs bg-muted">
        {getInitials(participant.name)}
      </AvatarFallback>
    </Avatar>
  );
}
