import StoryDetailPresenter from "./story-detail-presenter.js";

export default class StoryDetailPage {
  async render() {
    return `
      <section class="container" tabindex="0" aria-label="Story Detail Page">
        <h1>Story Detail</h1>
        <div id="story-detail-content">Loading...</div>
        <div id="story-map" style="height: 400px; margin-top: 20px; border-radius: 8px; background: #f5f5f5; border: 1px solid #ccc;"></div>
        <button id="back-button" class="btn">Back to Stories</button>
      </section>

      <style>
        .container {
          max-width: 1900px;  
          padding: 20px;
          text-align: center;
        }

        h1 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #333;
        }

        #story-detail-content {
          font-size: 16px;
          color: #444;
          background-color: #fafafa;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        #story-map {
          margin-bottom: 20px;
        }

       .btn {
          background-color:rgb(49, 84, 97);
          color: white;
          padding: 10px 20px;
          margin-top: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 15px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .btn:hover {
          background-color: #264653;
        }

        .btn:focus {
          outline: none;
          border-color: #666;
        }
      </style>

    `;
  }

  async afterRender() {
    this.presenter = new StoryDetailPresenter(this);
    await this.presenter.init();
  }

  showLoginPrompt() {
    const content = document.getElementById("story-detail-content");
    content.innerHTML = "<p>Please login to view story details.</p>";
  }

  showError(message) {
    const content = document.getElementById("story-detail-content");
    content.innerHTML = `<p>${message}</p>`;
  }

  renderStoryDetail(story) {
    const content = document.getElementById("story-detail-content");
    content.innerHTML = `
      <img src="${story.photoUrl}" alt="Photo of story by ${story.name}" style="max-width: 100%; height: auto; border-radius: 8px;" />
      <h2>${story.name}</h2>
      <p>${story.description}</p>
      <p>Created at: ${new Date(story.createdAt).toLocaleString()}</p>
      ${story.lat !== null && story.lon !== null ? `<p>Location: (${story.lat.toFixed(4)}, ${story.lon.toFixed(4)})</p>` : ""}
    `;
  }

  showNoLocation() {
    const mapContainer = document.getElementById("story-map");
    mapContainer.innerHTML = "<p>No location data available for this story.</p>";
  }
}
