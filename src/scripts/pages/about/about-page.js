import AboutPresenter from "./about-presenter.js";

export default class AboutPage {
  async render() {
    return `
      <section class="container" tabindex="0" aria-label="About Page">
        <h1>About Page</h1>
        <p>This is the about page of the application.</p>
        <p>Here you can find information about the application, its features, and how to use it.</p>
        <p>For more information, please visit our <a href="https://example.com" target="_blank">website</a>.</p>
        <p>If you have any questions, feel free to contact us at <a href="mailto:info@example.com">info@example.com</a>.</p>
      </section>

      <style>
        .container {
          max-width: 1800px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }

        h1 {
          font-size: 36px;
          margin-bottom: 40px;
          font-weight: 700;
          color: #222;
        }

        p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 15px;
          color: #555;
        }

        a {
          color: #007BFF;
          text-decoration: none;
          font-weight: 500;
        }

        a:hover {
          text-decoration: underline;
        }
      </style>
    `;
  }

  async afterRender() {
    this.presenter = new AboutPresenter(this);
    await this.presenter.init();
  }
}
