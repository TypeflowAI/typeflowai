import { Body, Column, Container, Html, Img, Link, Row, Section } from "@react-email/components";
import { Tailwind } from "@react-email/components";
import { Fragment } from "react";
import React from "react";

interface EmailTemplateProps {
  content: JSX.Element;
}

export const EmailTemplate = ({ content }: EmailTemplateProps) => (
  <Html>
    <Tailwind>
      <Fragment>
        <Body
          className="m-0 h-full w-full justify-center bg-slate-100 bg-slate-50 p-6 text-center text-base font-medium text-slate-800"
          style={{
            fontFamily: "'Poppins', 'Helvetica Neue', 'Segoe UI', 'Helvetica', 'sans-serif'",
          }}>
          <Section className="flex items-center justify-center">
            <Link href="https://typeflowai.com?utm_source=email_header&utm_medium=email" target="_blank">
              <Img
                src="https://s3.eu-central-1.amazonaws.com/listmonk-typeflowai/TypeflowAI-Light-transparent.png"
                alt="TypeflowAI Logo"
                className="w-80"
              />
            </Link>
          </Section>
          <Container className="mx-auto my-8 max-w-xl bg-white p-4 text-left">{content}</Container>

          <Section>
            <Row>
              <Column align="right" key="twitter">
                <Link target="_blank" href="https://twitter.com/typeflowai">
                  <Img
                    title="Twitter"
                    src="https://s3.eu-central-1.amazonaws.com/listmonk-typeflowai/Twitter-transp.png"
                    alt="Tw"
                    width="32"
                  />
                </Link>
              </Column>
              <Column align="center" className="w-20" key="github">
                <Link target="_blank" href="https://typeflowai.com/github">
                  <Img
                    title="GitHub"
                    src="https://s3.eu-central-1.amazonaws.com/listmonk-typeflowai/Github-transp.png"
                    alt="GitHub"
                    width="32"
                  />
                </Link>
              </Column>
              <Column align="left" key="discord">
                <Link target="_blank" href="https://typeflowai.com/discord">
                  <Img
                    title="Discord"
                    src="https://s3.eu-central-1.amazonaws.com/listmonk-typeflowai/Discord-transp.png"
                    alt="Discord"
                    width="32"
                  />
                </Link>
              </Column>
            </Row>
          </Section>
          <Section className="mt-4 text-center">
            TypeflowAI {new Date().getFullYear()}. All rights reserved.
            <br />
            <Link
              href="https://typeflowai.com/imprint?utm_source=email_footer&utm_medium=email"
              target="_blank">
              Imprint
            </Link>{" "}
            |{" "}
            <Link
              href="https://typeflowai.com/privacy-policy?utm_source=email_footer&utm_medium=email"
              target="_blank">
              Privacy Policy
            </Link>
          </Section>
        </Body>
      </Fragment>
    </Tailwind>
  </Html>
);
