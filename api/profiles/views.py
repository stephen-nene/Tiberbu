from django.shortcuts import render
import requests
from django.views import View
from django.http import JsonResponse

# Create your views here.



class FunnyAPIView(View):
    def get_chuck_norris_joke(self):
        """Fetch a random Chuck Norris joke."""
        try:
            response = requests.get("https://api.chucknorris.io/jokes/random", timeout=5)
            response.raise_for_status()  # Raise an error for bad status codes
            return response.json().get("value", "Chuck Norris is too powerful to joke about.")
        except (requests.RequestException, ValueError):
            return "Chuck Norris once roundhouse kicked a server, and it's still down."

    def get_dad_joke(self):
        """Fetch a random dad joke."""
        try:
            headers = {"Accept": "application/json"}
            response = requests.get("https://icanhazdadjoke.com/", headers=headers, timeout=5)
            response.raise_for_status()
            return response.json().get("joke", "Why don't skeletons fight each other? They don't have the guts.")
        except (requests.RequestException, ValueError):
            return "I'm reading a book on anti-gravity. It's impossible to put down!"

    def get_random_meme(self):
        """Fetch a random meme image."""
        try:
            response = requests.get("https://some-random-api.com/meme", timeout=5)
            response.raise_for_status()
            return response.json().get("image", "https://i.imgur.com/funny-meme.jpg")
        except (requests.RequestException, ValueError):
            return "https://i.imgur.com/fallback-meme.jpg"

    def get_programming_joke(self):
        """Fetch a random programming joke."""
        try:
            response = requests.get("https://official-joke-api.appspot.com/jokes/programming/random", timeout=5)
            response.raise_for_status()
            if response.json():
                return response.json()[0]
            return {"setup": "Why do programmers prefer dark mode?", "punchline": "Because light attracts bugs."}
        except (requests.RequestException, ValueError):
            return {"setup": "Why do programmers hate nature?", "punchline": "It has too many bugs."}

    def get_inspirational_quote(self):
        """Fetch a random inspirational quote."""
        try:
            response = requests.get("https://api.quotable.io/random", timeout=5)
            response.raise_for_status()
            return {
                "quote": response.json().get("content", "Stay hungry, stay foolish."),
                "author": response.json().get("author", "Steve Jobs"),
            }
        except (requests.RequestException, ValueError):
            return {
                "quote": "When something is important enough, you do it even if the odds are not in your favor.",
                "author": "Elon Musk",
            }

    def get(self, request, *args, **kwargs):
        """Handle GET requests and return a dynamic response based on the 'type' parameter."""
        content_type = request.GET.get("type", "chuck_norris")  # Default to Chuck Norris jokes

        if content_type == "chuck_norris":
            content = {"chuck_norris_joke": self.get_chuck_norris_joke()}
        elif content_type == "dad_joke":
            content = {"dad_joke": self.get_dad_joke()}
        elif content_type == "meme":
            content = {"meme": self.get_random_meme()}
        elif content_type == "programming_joke":
            content = {"programming_joke": self.get_programming_joke()}
        elif content_type == "inspirational_quote":
            content = {"inspirational_quote": self.get_inspirational_quote()}
        else:
            # Return error with documentation
            content = {
                "error": "Invalid content type specified.",
                "documentation": {
                    "supported_types": {
                        "type=chuck_norris": "Returns a Chuck Norris joke.",
                        "type=dad_joke": "Returns a dad joke.",
                        "type=meme": "Returns a random meme.",
                        "type=programming_joke": "Returns a programming joke.",
                        "type=inspirational_quote": "Returns an inspirational quote.",
                    },
                    "message": "Please use one of the supported types.",
                },
            }

        # Add a default message and status
        response_data = {
            "message": "Welcome to the ultimate API of chaos!",
            "status": "🔥 Ready to roll!",
            **content,  # Merge the content into the response
        }

        return JsonResponse(response_data)
    
    