const apiUrl = "https://68219a2d259dad2655afc2ba.mockapi.io";
const imageUrl = document.getElementById("imageUrl");
const postText = document.getElementById("postText");
const button = document.getElementById("submit");
const currentUser = localStorage.getItem("username");

button.addEventListener("click", async (e) => {
  if (!currentUser) {
    alert("You must be logged in to create a post");
    return;
  }
  
  const response = await fetch(`${apiUrl}/post`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      imageUrl: imageUrl.value,
      text: postText.value,
      comments: [],
      author: currentUser
    }),
  });

  getPosts();
});

async function getPosts() {
  const res = await fetch(`${apiUrl}/post`);
  const posts = await res.json();
  displayPosts(posts);
}

function displayPosts(posts) {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";
  
  posts.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card p-3 mb-3";
    
    // Post content
    const img = document.createElement("img");
    img.src = item.imageUrl; 
    img.style.width = "150px"; 
    
    const title = document.createElement("h4");
    title.innerText = item.text;
    
    const author = document.createElement("small");
    author.className = "text-muted";
    author.innerText = `Posted by: ${item.author}`;
    
    // Delete post button (only for author)
    if (currentUser === item.author) {
      const deletePostBtn = document.createElement("button");
      deletePostBtn.className = "btn btn-danger btn-sm my-2";
      deletePostBtn.innerText = "Delete Post";
      deletePostBtn.onclick = async () => {
        await fetch(`${apiUrl}/post/${item.id}`, { method: "DELETE" });
        getPosts();
      };
      card.appendChild(deletePostBtn);
    }
    
    // Comments 
    const commentsDiv = document.createElement("div");
    commentsDiv.className = "mt-3";
    const commentsHeader = document.createElement("h5");
    commentsHeader.innerText = "Comments:";
    commentsDiv.appendChild(commentsHeader);
    
    const commentUl = document.createElement("ul");
    commentUl.className = "list-group";
    

    //     addComment.addEventListener("click", async (e) => {
    //   // post create post
    //   const response = await fetch(`${apiUrl}/post/${item.id}`, {
    //     method: "POST",
    //     headers: {
    //       "Content-type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       comment: [commentInput.value],
    //     }),
    //   });
    // });

    // Display existing comments
    if (item.comments && item.comments.length > 0) {
      item.comments.forEach((comment, index) => {
        const commentLi = document.createElement("li");
        commentLi.className = "list-group-item d-flex justify-content-between align-items-center";
        
        const commentContent = document.createElement("div");
        commentContent.innerHTML = `<strong>${comment.author}:</strong> ${comment.text}`;
        
        commentLi.appendChild(commentContent);
        
        // Delete comment button (only for comment author)
        if (currentUser === comment.author) {
          const deleteCommentBtn = document.createElement("button");
          deleteCommentBtn.className = "btn btn-sm btn-outline-danger";
          deleteCommentBtn.innerText = "Delete";
          deleteCommentBtn.onclick = async () => {
            const updatedComments = [...item.comments];
            updatedComments.splice(index, 1);
            
            await fetch(`${apiUrl}/post/${item.id}`, {
              method: "PUT",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                comments: updatedComments
              }),
            });
            
            getPosts();
          };
          commentLi.appendChild(deleteCommentBtn);
        }
        
        commentUl.appendChild(commentLi);
      });
    } else {
      const noComments = document.createElement("li");
      noComments.className = "list-group-item";
      noComments.innerText = "No comments yet";
      commentUl.appendChild(noComments);
    }
    
    // Add comment form (only for logged in users)
    if (currentUser) {
      const commentForm = document.createElement("div");
      commentForm.className = "mt-3";
      
      const commentInput = document.createElement("input");
      commentInput.className = "form-control mb-2";
      commentInput.placeholder = "Write a comment...";
      
      const addCommentBtn = document.createElement("button");
      addCommentBtn.className = "btn btn-primary btn-sm";
      addCommentBtn.innerText = "Add Comment";
      
      addCommentBtn.onclick = async () => {
        if (!commentInput.value.trim()) return;
        
        const newComment = {
          author: currentUser,
          text: commentInput.value
        };
        
        const updatedComments = [...(item.comments || []), newComment];
        
        await fetch(`${apiUrl}/post/${item.id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            comments: updatedComments
          }),
        });
        
        getPosts();
      };
      
      commentForm.appendChild(commentInput);
      commentForm.appendChild(addCommentBtn);
      commentsDiv.appendChild(commentForm);
    }
    
    // Assemble the card
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(commentsDiv);
    commentsDiv.appendChild(commentUl);
    
    container.appendChild(card);
  });
}

// Initial load
getPosts();