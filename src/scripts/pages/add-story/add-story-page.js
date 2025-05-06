import AddStoryPresenter from "./add-story-presenter.js";

export default class AddStoryPage {
  async render() {
    return `
      <section class="container" tabindex="0" aria-label="Add New Story Page">
        <h1>Add New Story</h1>
        <form id="add-story-form" aria-describedby="add-story-desc">
          <p id="add-story-desc">Fill in the form to add a new story.</p>
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" name="description" required aria-required="true"></textarea>
          </div>
          <div class="form-group">
            <label for="photo">Photo (max 1MB):</label>
            <input type="file" id="photo" name="photo" accept="image/*" aria-required="true" />
            <button type="button" id="open-camera-btn" class="btn" style="margin-top: 10px;">Ambil Gambar dengan Kamera</button>
            <div id="camera-preview" style="display:none; margin-top: 10px;">
              <video id="video" width="320" height="240" autoplay></video>
              <button type="button" id="capture-btn" class="btn" style="margin-top: 10px;">Ambil Gambar</button>
              <button type="button" id="close-camera-btn" class="btn" style="margin-top: 10px; background-color: #e76f51;">Tutup Kamera</button>
            </div>
          </div>
          <div class="form-group">
            <label for="map">Select Location:</label>
            <div id="map" style="height: 300px; background: #f5f5f5; border: 1px solid #ccc;"></div>
            <input type="hidden" id="lat" name="lat" />
            <input type="hidden" id="lon" name="lon" />
          </div>
          <button type="submit" class="btn">Add Story</button>
        </form>
        <div id="add-story-message" role="alert" aria-live="polite"></div>
      </section>

      <style>
        .container {
          max-width: 1800px;
          padding: 20px;
          margin: 0 auto;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #333;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 6px;
          font-weight: 500;
          color: #555;
        }
        input[type="file"],
        textarea {
          padding: 8px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 6px;
          background-color: #fafafa;
        }
        textarea {
          resize: vertical;
          min-height: 100px;
        }
        input[type="file"] {
          background-color: white;
        }
        #map {
          margin-top: 8px;
          border-radius: 6px;
        }
        .btn {
          background-color: #264653;
          color: #fff;
          padding: 10px 20px;
          margin-top: 10px;
          border: none;
          border-radius: 6px;
          font-size: 15px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .btn:hover {
          background-color: #2a9d8f;
        }
        .btn:focus {
          outline: none;
          border-color: #666;
        }
      </style>
    `;
  }

  async afterRender() {
    this.presenter = new AddStoryPresenter(this);
    await this.presenter.init();
  }
}
