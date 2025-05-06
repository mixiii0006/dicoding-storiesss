import LoginPresenter from "./login-presenter.js";

export default class LoginPage {
  async render() {
    return `
      <section class="container form-container" tabindex="0" aria-label="Login Page">
        <h1 class="form-title">Login</h1>
        <form id="login-form" aria-describedby="login-desc" class="form">
          <p id="login-desc">Please enter your email and password to login.</p>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required aria-required="true" class="form-input" />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required aria-required="true" minlength="8" class="form-input" />
          </div>
          <button type="submit" class="form-button">Login</button>
        </form>
        <div id="login-message" role="alert" aria-live="polite"></div>
      </section>
      
      <style>
        .container {
            max-width: 1800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }

        .main-content {
            margin-top: 20px; 
        }
      </style>
      
    `;
  }

  async afterRender() {
    this.presenter = new LoginPresenter(this);
    this.presenter.init();
  }
}
