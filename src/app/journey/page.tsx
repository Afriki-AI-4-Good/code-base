import { CustomerJourney } from "./CustomerJourney";

export const metadata = {
  title: "Afriki Customer Journey",
  description:
    "A clickable walkthrough of the current Afriki app: organization login, AI Agent console, news, funding, and reports.",
};

export default function JourneyPage() {
  return <CustomerJourney />;
}
