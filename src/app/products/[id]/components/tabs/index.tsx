import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import PageTab1 from "./tab1";
import PageTab2 from "./tab2";
import PageTab3 from "./tab3";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "توضیحات",
    children: <PageTab1 />,
  },
  {
    key: "2",
    label: "اطلاعات تکمیلی",
    children: <PageTab2 />,
  },
  {
    key: "3",
    label: "بررسی کنید",
    children: <PageTab3 />,
  },
];

export default function SinglePageTabSelector() {
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Detect the current page's direction
    const pageDirection = document.documentElement.getAttribute("dir");
    if (pageDirection === "rtl") {
      setDirection("rtl");
    } else {
      setDirection("ltr");
    }
  }, [isMounted]);

  return (
    <div className="mt-20 pt-4 border-t border-b border-gray-200">
      <Tabs tabBarExtraContent  items={items} centered direction={direction} />
    </div>
  );
}
