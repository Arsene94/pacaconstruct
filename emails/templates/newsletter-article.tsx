import * as React from "react";
import { Img } from "@react-email/components";
import { EmailLayout, EmailHeading, EmailText } from "../components/email-layout";
import { EmailButton } from "../components/button";
import { EMAIL_WIDTH } from "../brand";
import type { NewsletterArticleProps } from "../types";

/** Marketing — anunț articol nou de blog (necesită unsubscribe). */
export function NewsletterArticleEmail({
  title,
  excerpt,
  url,
  imageUrl,
  unsubscribeUrl,
}: NewsletterArticleProps) {
  return (
    <EmailLayout preview={excerpt} unsubscribeUrl={unsubscribeUrl}>
      {imageUrl ? (
        <Img
          src={imageUrl}
          alt={title}
          width={EMAIL_WIDTH - 48}
          style={{
            width: "100%",
            maxWidth: `${EMAIL_WIDTH - 48}px`,
            height: "auto",
            borderRadius: "2px",
            marginBottom: "16px",
          }}
        />
      ) : null}
      <EmailHeading>{title}</EmailHeading>
      <EmailText>{excerpt}</EmailText>
      <EmailButton href={url}>Citește articolul</EmailButton>
    </EmailLayout>
  );
}

NewsletterArticleEmail.PreviewProps = {
  title: "Cum alegi utilajul potrivit pentru terasamente",
  excerpt:
    "Un ghid scurt despre cum să alegi excavatorul potrivit în funcție de tipul de sol, accesul în șantier și volumul de lucrare.",
  url: "https://pacaconstruct.ro/blog/utilaj-terasamente",
  imageUrl: "https://pacaconstruct.ro/og/blog-utilaj.jpg",
  unsubscribeUrl: "https://pacaconstruct.ro/unsubscribe?token=sample",
} satisfies NewsletterArticleProps;

export default NewsletterArticleEmail;
