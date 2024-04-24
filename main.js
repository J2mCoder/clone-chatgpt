const form = document.querySelector("form")
const chatContainer = document.querySelector("#chat_container")
const body = document.querySelector("body")
document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", handleForm)

  form.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      form.dispatchEvent(new Event('submit'))
      console.log('form submitted enter')
    }
  })

})

const handleForm = async (event) => {

  event.preventDefault()
  const form = event.target
  console.log(form.elements["promt"].value)
  const inputValue = form.elements["promt"].value;
  chatContainer.innerHTML += chatStripe(false, inputValue)
  sendMessageToChatGPT(inputValue)

  form.reset()

  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  })

  const uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId)
  const MessageDiv = document.getElementById(uniqueId)
  loader(MessageDiv)

}

let loadInterval;

function loader(element) {
  element.textContent = ""
  loadInterval = setInterval(() => {
    element.textContent += "."
    if (element.textContent === "....") {
      element.textContent = ""
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index)
      index++
    } else {
      clearInterval(interval)
    }
  }, 50)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`
}

console.log(generateUniqueId())

function chatStripe(isAi, value, uniqueId) {
  return `
        <div class="flex flex-col">
          <div class="flex">
            <div class="min-w-[25px] h-10">
            ${isAi ? "<i class='ri-openai-fill md:text-3xl text-xl'></i>" : "<i class='ri-user-line md:text-3xl text-xl'></i>"}
            </div>
            <div class="flex flex-col ml-3">
              <span class="font-semibold text-xl">${isAi ? "ChatGPT" : "You"}</span>
              <p class="text-md" id='${uniqueId}'>${value}</p>
            </div>
          </div>
        </div>
 `
}

const apiKey = '';

// Fonction pour envoyer une requête à ChatGPT
async function sendMessageToChatGPT() {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Compose a poem that explains the concept of recursion in programming."
        }
      ],
      max_tokens: 100
    })
  });
  const data = await response.json();
  console.log(data)
}
sendMessageToChatGPT()