import { Eye, Download, User } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "wouter";

interface TopBarProps {
  onPreview?: () => void;
  onDownload?: () => void;
  showActions?: boolean;
}

export function TopBar({ onPreview, onDownload, showActions = true }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 md:px-6 justify-between">
        <Link href="/app/invoice" className="flex items-center gap-2">
          <img src="/logo.png" alt="YASI Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold tracking-tight gradient-text">YASI</span>
        </Link>
        <div className="flex items-center gap-4">
          {showActions && (
            <>
              <Button variant="secondary" onClick={onPreview}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={onDownload} className="gradient-bg text-white border-0 shadow-lg shadow-indigo-500/20">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </>
          )}
          <div className="relative group">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
            
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1 flex flex-col">
                <Link href="/app/profile">
                  <span className="block px-4 py-2 text-sm hover:bg-muted cursor-pointer transition-colors">
                    Profile
                  </span>
                </Link>
                <Link href="/app/preferences">
                  <span className="block px-4 py-2 text-sm hover:bg-muted cursor-pointer transition-colors">
                    Preferences
                  </span>
                </Link>
                <div className="h-px bg-border my-1"></div>
                <Link href="/">
                  <span className="block px-4 py-2 text-sm text-destructive hover:bg-muted cursor-pointer transition-colors">
                    Logout
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
