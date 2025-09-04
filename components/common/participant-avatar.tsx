import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/helpers/common.helper";

type ParticipantAvatarProps = { participantName: string; className?: string };

export function ParticipantAvatar({
	participantName,
	className,
}: ParticipantAvatarProps) {
	return (
		<Avatar className={className}>
			<AvatarFallback className="text-xs bg-muted">
				{getInitials(participantName)}
			</AvatarFallback>
		</Avatar>
	);
}
