const LIMIT = 59;
const bskyPostId = document.querySelector("[data-bsky-post-id]").dataset.bskyPostId;
const container = document.querySelector("[data-bsky-container]");
const likesContainer = document.querySelector("[data-bsky-likes]");
const likesCount = document.querySelector("[data-bsky-likes-count]");
const myDid = "did:plc:gevyqibw5p2xsonkbsbjm5vy";
const bskyAPI = "https://public.api.bsky.app/xrpc/";
const getLikesURL = `${bskyAPI}app.bsky.feed.getLikes?limit=${LIMIT}&uri=`;
const getPostURL = `${bskyAPI}app.bsky.feed.getPosts?uris=`;

function drawHowManyMore(postLikesCount, likesActorLength) {
  if (postLikesCount > LIMIT) {
    const likesMore = document.createElement("li");
    likesMore.classList.add("post__like");
    likesMore.classList.add("post__like--howManyMore");
    likesMore.innerHTML = `+${postLikesCount - likesActorLength}`;
    likesContainer.appendChild(likesMore);
  }
}

function drawLikes(likesActors, postLikesCount) {
  for (const like of likesActors) {
    const likeEl = document.createElement("li");
    likeEl.classList.add("post__like");
    likeEl.innerHTML = `
      <img class="post__like__avatar" src="${like.actor.avatar.replace("avatar", "avatar_thumbnail")}" alt="${
      like.actor.displayName
    }" />`;
    likesContainer.appendChild(likeEl);
  }

  drawHowManyMore(postLikesCount, likesActors.length);
}

async function bskyName(postId) {
    if (bskyPostId !== "null") {
    const postUri = `at://${myDid}/app.bsky.feed.post/${postId}`;
    try {
      const bskyPost = await fetch(getPostURL + postUri);
      const bskyPostLikes = await fetch(getLikesURL + postUri);
      const postData = await bskyPost.json();
      const likesData = await bskyPostLikes.json();

      const totalLikesCount = postData.posts[0].likeCount;

      if (likesData.likes.length > 0) {
        likesCount.textContent = totalLikesCount;
        drawLikes(likesData.likes, totalLikesCount);
      }
    } catch (error) {
      container.remove();
    }
  }
}
bskyName(postId);