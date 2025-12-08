import FuzzyText from "@/components/FuzzyText";
import LetterGlitch from "@/components/LetterGlitch";

const NotFound = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <LetterGlitch
          glitchColors={["#0a0a0a", "#1f2937", "#4b5563", "#f43f5e"]}
        />
      </div>

      <div className="flex flex-col justify-center items-center h-full space-y-2">
        <div className="hidden sm:block cursor-pointer">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.62}
            enableHover={true}
          >
            404 Not Found
          </FuzzyText>
        </div>

        <div className="block  sm:hidden cursor-pointer text-center">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.62}
            enableHover={true}
          >
            404
          </FuzzyText>

          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.62}
            enableHover={true}
          >
            Not Found
          </FuzzyText>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
