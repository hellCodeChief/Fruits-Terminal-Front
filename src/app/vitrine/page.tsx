"use client";

import { getVitrineToday } from "@/components/utils/actionsClient";
import { Button, Card, Col, Empty, Row, Spin, Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function stallPhone() {
  return (process.env.NEXT_PUBLIC_STALL_PHONE || "").trim();
}

function photoUrl(fileId: string | null) {
  if (!fileId || !BASE_URL) return "";
  return `${BASE_URL}/files/${fileId}/product`;
}

function formatToman(price: number) {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

function whatsAppHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `98${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

type Today = {
  stallName: string;
  date: string;
  notice: string;
  items: {
    id: number;
    name: string;
    price: number;
    fileId: string | null;
  }[];
};

export default function VitrinePage() {
  const [data, setData] = useState<Today | null>(null);
  const [failed, setFailed] = useState(false);
  const phone = stallPhone();

  useEffect(() => {
    getVitrineToday()
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  return (
    <div style={{ padding: 16, paddingBottom: phone ? 120 : 16 }}>
      <Row justify="space-between" align="middle" gutter={[12, 12]}>
        <Col>
          <Typography.Title level={2} style={{ margin: 0 }}>
            {data?.stallName || "حجره"}
          </Typography.Title>
          <Typography.Text type="secondary">{data?.date || ""}</Typography.Text>
        </Col>
        <Col>
          <Link href="/vitrine/add">
            <Button type="primary">افزودن</Button>
          </Link>
        </Col>
      </Row>
      <Typography.Paragraph style={{ marginTop: 16 }}>
        {data?.notice || "حداقل یک جعبه · خرید خرد نداریم · پیکاپ از میدان"}
      </Typography.Paragraph>

      {!data && !failed && (
        <div style={{ textAlign: "center", padding: 48 }}>
          <Spin />
        </div>
      )}
      {failed && (
        <Typography.Paragraph style={{ textAlign: "center" }}>
          ویترین دریافت نشد
        </Typography.Paragraph>
      )}
      {data && data.items.length === 0 && (
        <Empty description="هنوز برای امروز چیزی ثبت نشده" />
      )}
      {data && data.items.length > 0 && (
        <Row gutter={[16, 16]}>
          {data.items.map((item) => {
            const src = photoUrl(item.fileId);
            return (
              <Col key={item.id} xs={24} md={12}>
                <Card
                  cover={
                    src ? (
                      <img
                        alt={item.name}
                        src={src}
                        style={{ height: 220, objectFit: "cover" }}
                      />
                    ) : undefined
                  }
                >
                  <Card.Meta
                    title={item.name}
                    description={`${formatToman(item.price)} · کیلو`}
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {phone && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            background: "#fff",
            padding: 12,
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Row gutter={8}>
            <Col span={12}>
              <Button block href={`tel:${phone}`}>
                تماس
              </Button>
            </Col>
            <Col span={12}>
              <Button block href={whatsAppHref(phone)}>
                واتساپ
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
