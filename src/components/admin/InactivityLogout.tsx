"use client";

import { useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function InactivityLogout() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 관리자 페이지에서 세션이 끊긴 경우 즉시 로그인 페이지로 이동
  useEffect(() => {
    if (status === "unauthenticated" && pathname.startsWith("/admin")) {
      router.replace("/login");
    }
  }, [status, pathname, router]);

  // 20분 (1200초)
  const INACTIVITY_LIMIT = 20 * 60 * 1000;

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (session) {
      timerRef.current = setTimeout(() => {
        // 활동 없음으로 인한 로그아웃
        signOut({ callbackUrl: "/login", redirect: true });
      }, INACTIVITY_LIMIT);
    }
  };

  useEffect(() => {
    if (!session) return;

    // 이벤트 리스너 등록
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // 초기 타이머 설정
    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [session]);

  return null;
}
