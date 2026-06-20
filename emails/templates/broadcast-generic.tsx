import * as React from "react";
import { EmailLayout, EmailHeading, EmailText } from "../components/email-layout";
import { EmailButton } from "../components/button";
import type { BroadcastGenericProps } from "../types";

/** Marketing — broadcast liber compus din admin (blocuri editabile). */
export function BroadcastGenericEmail({
  heading,
  blocks,
  unsubscribeUrl,
}: BroadcastGenericProps) {
  const preview = blocks.find((b) => b.type === "paragraph")?.text ?? heading;
  return (
    <EmailLayout preview={preview} unsubscribeUrl={unsubscribeUrl}>
      <EmailHeading>{heading}</EmailHeading>
      {blocks.map((block, i) => {
        if (block.type === "heading")
          return <EmailHeading key={i}>{block.text}</EmailHeading>;
        if (block.type === "paragraph")
          return <EmailText key={i}>{block.text}</EmailText>;
        return (
          <EmailButton key={i} href={block.href}>
            {block.text}
          </EmailButton>
        );
      })}
    </EmailLayout>
  );
}

BroadcastGenericEmail.PreviewProps = {
  heading: "Ofertă de primăvară la amenajări",
  blocks: [
    {
      type: "paragraph",
      text: "În această lună oferim 10% reducere la lucrările de terasamente și amenajări exterioare.",
    },
    { type: "button", text: "Cere o ofertă", href: "https://pacaconstruct.ro/contact" },
  ],
  unsubscribeUrl: "https://pacaconstruct.ro/unsubscribe?token=sample",
} satisfies BroadcastGenericProps;

export default BroadcastGenericEmail;
