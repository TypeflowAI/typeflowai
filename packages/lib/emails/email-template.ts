export const withEmailTemplate = (content: string) =>
  `<!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, minimum-scale=1"
      />
      <base target="_blank" />
  
      <style>
        body {
          background-color: #f1f5f9;
          font-family: "Poppins", "Helvetica Neue", "Segoe UI", Helvetica,
            sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 26px;
          margin: 0;
          color: #1e293b;
        }
  
        pre {
          background: #f4f4f4;
          padding: 2px;
        }

        hr {
          border-top: 1px dashed #94a3b8;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
  
        table {
          width: 100%;
        }
        table td {
          padding: 5px;
        }
        .socialicons {
          max-width: 200px;
          margin-left: auto;
          margin-right: auto;
          margin-top: 27px;
        }
  
        .wrap {
          background-color: #f8fafc;
          padding: 30px;
          max-width: 525px;
          margin: 0 auto;
          border-radius: 12px;
        }
        
        .brandcolor {
          color: #00c4b8;
        }

        .tooltip {
          background-color: #f1f5f9;
          padding: 1rem;
          border-radius: 1rem;
          color: #475569;
          margin-top: 15px;
          margin-bottom: 15px;
        }

        .tooltip a {
          color: #1e293b;
        }
  
        .button {
          margin-top:12px;
          background: #0f172a;
          border-radius: 8px;
          text-decoration: none !important;
          color: #fff !important;
          font-weight: 500;
          padding: 10px 30px;
          display: inline-block;
          font-size: 0.9em;
        }
        .button:hover {
          background: #334155;
        }
  
        .footer {
          text-align: center;
          font-size: 12px;
          color: #cbd5e1;
        }
        .footer a {
          color: #cbd5e1;
          margin-right: 5px;
        }
  
        .gutter {
          padding: 30px;
          text-align: center;
        }
  
        img {
          max-width: 100%;
          height: auto;
        }
  
        .gutter img {
          max-width: 280px;
        }
  
        a {
          color: #00c4b8;
        }
        a:hover {
          color: #00e6ca;
        }
        h1,
        h2,
        h3,
        h4 {
          font-weight: 600;
        }
        @media screen and (max-width: 600px) {
          .wrap {
            max-width: auto;
          }
          .gutter {
            padding: 10px;
          }
        }
      </style>
    </head>
    <body
      style="
        background-color: #f1f5f9;
        font-family: 'Poppins', 'Helvetica Neue', 'Segoe UI', Helvetica,
          sans-serif;
        font-size: 15px;
        line-height: 26px;
        margin: 0;
        color: #1e293b;
      "
    >
      <div class="gutter" style="padding: 30px">
        <a href="https://typeflowai.com" target="_blank">
          <img
            src="https://s3.eu-central-1.amazonaws.com/listmonk-typeflowai/TypeflowAI-Light-transparent.png"
            alt="TypeflowAI Logo"
        /></a>
      </div>
      <div
        class="wrap"
        style="
          background-color: #f8fafc;
          padding: 30px;
          max-width: 525px;
          margin: 0 auto;
          border-radius: 12px;
        "
      >
        ${content}
      </div>
  
      <div
        class="footer"
        style="text-align: center; font-size: 12px; color: #cbd5e1"
      >
        <table class="socialicons">
          <tr>
            <td>
              <a target="_blank" href="https://twitter.com/typeflowai"
                ><img
                  title="Twitter"
                  src="https://s3.eu-central-1.amazonaws.com/listmonk-typeflowai/Twitter-transp.png"
                  alt="Tw"
                  width="32"
              /></a>
            </td>
            <td>
              <a target="_blank" href="https://typeflowai.com/github"
                ><img
                  title="GitHub"
                  src="https://s3.eu-central-1.amazonaws.com/listmonk-typeflowai/Github-transp.png"
                  alt="GitHub"
                  width="32"
              /></a>
            </td>
            <td>
              <a target="_blank" href="https://typeflowai.com/discord"
                ><img
                  title="Discord"
                  src="https://s3.eu-central-1.amazonaws.com/listmonk-typeflowai/Discord-transp.png"
                  alt="Discord"
                  width="32"
              /></a>
            </td>
          </tr>
        </table>
        <p style="padding-top: 8px; line-height: initial">
          TypeflowAI ${new Date().getFullYear()}. All rights reserved.<br />
          <a
            style="text-decoration: none"
            href="https://typeflowai.com/imprint"
            target="_blank"
            >Imprint</a
          >
          |
          <a
            style="text-decoration: none"
            href="https://typeflowai.com/privacy-policy"
            target="_blank"
            >Privacy Policy</a
          >
        </p>
      </div>
    </body>
  </html>
  `;
