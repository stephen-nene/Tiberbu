import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Progress } from "@/components/shadcn/progress";
import {
  Rocket,
  Mail,
  Clock,
  Zap,
  Sparkles,
  Wrench,
  Coffee,
  PartyPopper,
  Bug,
  Code,
  Lightbulb,
  ThumbsUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
// import { useWindowSize } from "@uidotdev/usehooks";

const ComingSoon = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [progress, setProgress] = useState(5); // Start low for dramatic effect
  const [showConfetti, setShowConfetti] = useState(false);
  const [developerStatus, setDeveloperStatus] = useState("initializing...");
  const [secretClicks, setSecretClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showSecretButton, setShowSecretButton] = useState(false);
  // const windowSize = useWindowSize();
  const [isHoveringDev, setIsHoveringDev] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
    

  // Fun feature list with emojis
  const features = [
    { text: "AI-powered magic ✨", emoji: "✨" },
    { text: "Real-time collaboration 👥", emoji: "👥" },
    { text: "Next-gen analytics 📊", emoji: "📊" },
    { text: "Customizable workflows 🛠️", emoji: "🛠️" },
    { text: "Dark mode everywhere 🌙", emoji: "🌙" },
    { text: "Secret unicorn mode 🦄", emoji: "🦄" },
  ];

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      handleResize(); // Set initial size
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  // Simulate progress with dramatic jumps
  useEffect(() => {
    const progressStages = [10, 25, 40, 65, 78, 85, 92, 96, 99];
    let currentStage = 0;

    const timer = setInterval(() => {
      if (currentStage < progressStages.length) {
        setProgress(progressStages[currentStage]);
        currentStage++;
      } else {
        clearInterval(timer);
      }
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // Fun developer status updates
  useEffect(() => {
    const statuses = [
      { text: "coding...", emoji: "💻" },
      { text: "testing...", emoji: "🧪" },
      { text: "drinking coffee...", emoji: "☕" },
      { text: "fixing bugs...", emoji: "🐛" },
      { text: "optimizing...", emoji: "⚡" },
      { text: "deploying...", emoji: "🚀" },
      { text: "arguing with design...", emoji: "🎨" },
      { text: "in a meeting...", emoji: "😴" },
    ];

    const statusInterval = setInterval(() => {
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      setDeveloperStatus(`${randomStatus.text} ${randomStatus.emoji}`);
    }, 3000);

    return () => clearInterval(statusInterval);
  }, []);

  // Easter egg after 5 clicks on the coffee icon
  const handleSecretClick = () => {
    setSecretClicks((prev) => {
      if (prev >= 4 && !showEasterEgg) {
        setShowEasterEgg(true);
        toast.success("You found the secret developer mode!", {
          icon: "🦄",
          duration: 5000,
        });
        setTimeout(() => setShowEasterEgg(false), 10000);
      }
      return prev + 1;
    });
  };

  const handleSubscribe = () => {
    if (!email) {
      toast.error("Wait! You forgot to enter your email!", {
        icon: "🤔",
      });
      return;
    }

    if (!email.includes("@")) {
      toast.error("That doesn't look like an email... try again?", {
        icon: "👀",
      });
      return;
    }

    // Fake API call with fun messages
    toast.info("Sending carrier pigeon with your request...", {
      icon: "🐦",
      duration: 1000,
    });

    setTimeout(() => {
      setIsSubscribed(true);
      setShowConfetti(true);
      toast.success(
        <div>
          <p className="font-bold">You're in! 🎉</p>
          <p>We'll send you an exclusive preview when ready!</p>
        </div>,
        {
          duration: 5000,
        }
      );
      setTimeout(() => setShowConfetti(false), 5000);
    }, 1500);
  };

  const handleEarlyAccess = () => {
    setShowSecretButton(true);
    toast(
      <div>
        <p className="font-bold">Early access requested! 🚀</p>
        <p>Our team will review your application soon.</p>
      </div>,
      {
        duration: 4000,
        action: {
          label: "Cool!",
          onClick: () => {},
        },
      }
    );
  };

  const handleSecretFeature = () => {
    toast(
      <div className="flex items-center gap-2">
        <PartyPopper className="w-5 h-5" />
        <span>You unlocked a secret developer preview!</span>
      </div>,
      {
        duration: 6000,
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-400 p-4"> */}
      {showConfetti && windowSize.width && windowSize.height && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={800}
          gravity={0.2}
        />
      )}

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 shadow-2xl relative overflow-hidden">
          {/* Easter egg overlay */}
          {showEasterEgg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 z-0 pointer-events-none"
            />
          )}

          <CardHeader>
            <div className="flex items-center gap-3 relative z-10">
              <motion.div whileHover={{ rotate: 20 }} whileTap={{ scale: 0.9 }}>
                <Zap className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
              </motion.div>
              <div>
                <CardTitle className="text-3xl flex items-center gap-2">
                  Coming Soon!{" "}
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                  </motion.span>
                </CardTitle>
                <CardDescription className="text-lg dark:text-gray-300">
                  We're building something extraordinary{" "}
                  <span className="inline-block animate-bounce">🚀</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 relative z-10">
            <div>
              <p className="text-muted-foreground dark:text-gray-400 mb-4">
                The feature you're excited about isn't ready yet, but our team
                of digital wizards is working <strong>magic</strong> behind the
                scenes!
              </p>

              <div className="space-y-4">
                <div
                  className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400 cursor-help"
                  onMouseEnter={() => setIsHoveringDev(true)}
                  onMouseLeave={() => setIsHoveringDev(false)}
                  onClick={handleSecretClick}
                >
                  <Wrench className="w-4 h-4" />
                  <span>
                    {developerStatus}{" "}
                    {isHoveringDev && (
                      <span className="text-xs opacity-70">(click me!)</span>
                    )}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground dark:text-gray-400">
                      Launch progress
                    </span>
                    <span className="font-medium">
                      {progress}%{" "}
                      {progress > 90 && (
                        <span className="text-green-500">🔥</span>
                      )}
                    </span>
                  </div>
                  <Progress
                    value={progress} // The progress value (0 to 100)
                    className="h-2" // Optional custom styling for the progress container
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" /> Sneak peek at
                what's coming:
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-yellow-500 dark:text-yellow-400">
                      {feature.emoji}
                    </span>
                    {feature.text}
                  </motion.li>
                ))}
              </ul>
            </div>

            <AnimatePresence>
              {!isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-2"
                >
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Want exclusive early access? Join the waitlist!
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSubscribe}>
                      <Mail className="mr-2 h-4 w-4" /> Notify Me
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 text-center"
                >
                  <p className="text-green-700 dark:text-green-400 font-medium flex items-center justify-center gap-2">
                    <ThumbsUp className="w-4 h-4" /> You're on the list! We'll
                    email you at{" "}
                    <span className="font-semibold underline">{email}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-700 pt-4 relative z-10">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              <Clock className="mr-2 h-4 w-4" /> Go Back
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground dark:text-gray-400">
                  Or
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Button
                onClick={handleEarlyAccess}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white dark:from-yellow-600 dark:to-orange-600 dark:hover:from-yellow-700 dark:hover:to-orange-700 shadow-lg"
              >
                <Rocket className="mr-2 h-4 w-4" /> Request Early Access
              </Button>

              {showSecretButton && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    variant="outline"
                    onClick={handleSecretFeature}
                    className="w-full border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  >
                    <Code className="mr-2 h-4 w-4" /> Secret Developer Preview
                  </Button>
                </motion.div>
              )}
            </div>

            <div
              className="text-xs text-muted-foreground dark:text-gray-500 flex items-center justify-center gap-1 mt-2 cursor-pointer"
              onClick={handleSecretClick}
            >
              <Coffee className="w-3 h-3" /> Our developers need caffeine to
              work faster (click me!)
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
