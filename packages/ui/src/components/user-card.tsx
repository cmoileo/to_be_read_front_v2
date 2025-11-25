import { User, UserAuthor } from "@repo/types";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Card, CardContent, CardHeader } from "./card";

interface UserCardProps {
  user: User | UserAuthor;
  onClick?: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={onClick}>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <Avatar>
          <AvatarImage src={user.avatar || undefined} alt={user.userName} />
          <AvatarFallback>{user.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">@{user.userName}</p>
        </div>
      </CardHeader>
      {"biography" in user && user.biography && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{user.biography}</p>
        </CardContent>
      )}
    </Card>
  );
}
