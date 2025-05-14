const apiUrl = "https://68219a2d259dad2655afc2ba.mockapi.io";
const imageUrl = document.getElementById("imageUrl");
const postText = document.getElementById("postText");
const button = document.getElementById("submit");

button.addEventListener("click", async (e) => {
  // post create post
  const response = await fetch(`${apiUrl}/post`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      imageUrl: imageUrl.value,
      text: postText.value,
      comment: [],
    }),
  });

  // const data = await response.json();
  // console.log("تم نشر", data);
  // alert("تم النشر");
  getPosts();
  addCo() 
});

async function getPosts() {
  const res = await fetch(`${apiUrl}/post`);
  const posts = await res.json();
  displayPosts(posts);
}
function displayPosts(posts) {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";
  const commentsDiv = document.createElement("div");
  posts.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    const img = document.createElement("img");
    img.src = item.imageUrl; 
    img.style.width = "150px"; 
    const title = document.createElement("h4");
    const commentUl = document.createElement("ul"); // here ul 
    title.innerText = item.text; 

    const commentLi = document.createElement("li"); // to display  comment and delete button 
    commentLi.style.display = "flex"; 
    let comment = document.createElement("p"); // to print comment 
    comment.innerText = "test comment"; 
    let deleteComment = document.createElement("button"); // to delete comment  
    deleteComment.innerText = "delete comment"; 

    commentLi.appendChild(comment); 
    commentLi.appendChild(deleteComment); 

    let commentDivHeder = document.createElement("div"); // to display input to comment and add button 

    let commentInput = document.createElement("input"); // to write comment 
    let addComment = document.createElement("button"); // to add comment 
    addComment.innerText = "Add comment"; 

    commentDivHeder.appendChild(commentInput); 
    commentDivHeder.appendChild(addComment); 
    card.appendChild(img);
    card.appendChild(title);
    commentUl.appendChild(commentLi);
    card.appendChild(commentUl);
    card.appendChild(commentDivHeder); 
    container.appendChild(card);
  });
}

    addComment.addEventListener("click", async (e) => {
      // post create post
      const response = await fetch(`${apiUrl}/post/${item.id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          comment: [commentInput.value],
        }),
      });
    });