import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function FloatingCTA() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        className="rounded-full w-14 h-14 glow-effect hover:scale-110 transition-all duration-300"
        asChild
        data-testid="floating-cta-button"
      >
        <Link href="/contact">
          <MessageCircle className="w-6 h-6" />
        </Link>
      </Button>
    </div>
  );
}
