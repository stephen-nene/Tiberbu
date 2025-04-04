import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Construction,
  Mail,
  Clock,
  Calendar,
  Rocket,
  Coffee,
  Wrench,
  PartyPopper,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Progress } from "@/components/shadcn/progress";
import { Badge } from "@/components/shadcn/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { toast } from "sonner";

const ComingSoon = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [progress, setProgress] = useState(13);
  const [showConfetti, setShowConfetti] = useState(false);
  const [constructionWorkers, setConstructionWorkers] = useState(3);
  const [coffeeConsumed, setCoffeeConsumed] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Simulate development progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newValue = prev + Math.random() * 2;
        return newValue > 97 ? 97 : newValue;
      });

      // Random construction events
      if (Math.random() > 0.7) {
        setConstructionWorkers((prev) => {
          const change = Math.random() > 0.5 ? 1 : -1;
          return Math.max(1, prev + change);
        });
      }

      // Coffee consumption correlates with workers
      setCoffeeConsumed((prev) => prev + constructionWorkers * 0.2);
    }, 1500);

    return () => clearInterval(timer);
  }, [constructionWorkers]);

  const handleSubscribe = () => {
    if (!email.includes("@")) {
      toast.error("Invalid Email", {
        // title: "Invalid Email",
        description: "Please enter a valid email address",
        // variant: "destructive",
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setShowConfetti(true);
      setIsSubscribed(true);
      toast.error("You're on the list!", {
        // title: "You're on the list!",
        description: "We'll notify you when this feature launches",
      });
      setTimeout(() => setShowConfetti(false), 3000);
    }, 1000);
  };

  const boostProgress = () => {
    setProgress((prev) => {
      const boost = 5 + Math.random() * 10;
      return prev + boost > 97 ? 97 : prev + boost;
    });
    setCoffeeConsumed((prev) => prev + 2);
    toast.success("", {
      title: "Progress Boosted!",
      description: "Your enthusiasm fuels our development",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-rose-900/60 dark:to-rose-950/40 p-4">
      <AnimatePresence>
      
        {showConfetti && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none flex justify-center items-end"
          >
            <PartyPopper className="w-full h-full text-yellow-400" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-amber-200 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <Construction className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-3xl text-amber-900">
                  Under Construction!
                </CardTitle>
                <CardDescription className="text-lg">
                  The feature you're looking for isn't ready yet
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="font-medium text-amber-800">
                We're working hard to build something amazing!
              </p>
              <p className="text-sm text-amber-700">
                You tried to access an upcoming feature that's still in
                development. While our team is coding away, here's what's
                happening behind the scenes:
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-600" />
                  <span className="font-medium">Development Progress</span>
                </div>
                <Badge variant="outline" className="border-amber-300">
                  {Math.floor(progress)}% complete
                </Badge>
              </div>
              <Progress value={progress} className="h-2 bg-amber-100" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-amber-100 rounded">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </span>
                  <div>
                    <p className="text-amber-500">Active Workers</p>
                    <p className="font-medium">
                      {constructionWorkers} developers
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-amber-100 rounded">
                    <Coffee className="w-4 h-4 text-amber-600" />
                  </span>
                  <div>
                    <p className="text-amber-500">Coffee Consumed</p>
                    <p className="font-medium">
                      {Math.floor(coffeeConsumed)} cups
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-medium text-amber-800">
                Want to be the first to know when it's ready?
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-amber-300 focus:border-amber-500"
                />
                <Button
                  onClick={handleSubscribe}
                  disabled={isSubscribed}
                  className={cn(
                    "bg-amber-600 hover:bg-amber-700",
                    isSubscribed && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {isSubscribed ? "Subscribed!" : "Notify Me"}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t border-amber-200 pt-4">
            <Button
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={boostProgress}
            >
              <Rocket className="mr-2 h-4 w-4" />
              Boost Development Speed
            </Button>

            <div className="w-full flex items-center justify-between">
              <Button
                variant="ghost"
                className="text-amber-600 hover:bg-amber-100"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>

              <Button
                variant="link"
                className="text-amber-600 flex items-center"
                onClick={() => navigate("/")}
              >
                Go Home <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
