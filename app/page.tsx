import HomeExperience from "~/app/_components/home-experience";
import { LIVE_DROP, NEXT_DROP } from "~/app/_constants/drops";

export default function Home() {
  return <HomeExperience drop={LIVE_DROP} nextDrop={NEXT_DROP} />;
}
