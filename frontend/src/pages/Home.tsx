import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-8 text-center">
      <p className="text-lo text-sm mb-4">Shivam Verma — AI-powered portfolio</p>
      <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] mb-6 max-w-2xl">
        Ask me anything.
        <br />
        I'll answer like I'm
        <br />
        in the room.
      </h1>
      <p className="text-lo text-lg max-w-md mb-10">
        This is a live conversation with an AI trained on my resume —
        my experience, projects, and skills. Interview me the way
        you'd interview any candidate.
      </p>
      <button
        onClick={() => navigate("/chat")}
        className="bg-gold hover:bg-goldSoft text-ink font-medium
                   px-6 py-3 rounded-full transition-colors"
      >
        Start the Chat
      </button>
    </div>
  );
}