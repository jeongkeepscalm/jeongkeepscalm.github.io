// 이미지 링크 클릭 시 모달 열기
let test ;

document.getElementById("imageLink").addEventListener("click", function(event) {
  event.preventDefault(); // 링크의 기본 동작 방지
  
  var modal = document.getElementById("imageModal");
  var modalImage = document.getElementById("modalImage");
  
  test = this;

  modal.style.display = "block";
  modalImage.src = "http://127.0.0.1:4000/assets/images/spring/mvc1.png";
});

// 모달 닫기 버튼 및 모달 외부 클릭 시 모달 닫기
document.querySelector(".modal .close").addEventListener("click", function() {
  var modal = document.getElementById("imageModal");
  modal.style.display = "none";
});

window.addEventListener("click", function(event) {
  var modal = document.getElementById("imageModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});