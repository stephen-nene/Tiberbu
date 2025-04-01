from django.core.mail import send_mail
from django.conf import settings

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

def send_custom_email(to_email, subject, template_name, context):

    html_content = render_to_string(template_name, context)  
    text_content = f"Hi {context.get('senderName', 'User')},\n\nThis is the plain text version of your email."

    # Create the email
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content, 
        from_email=settings.EMAIL_HOST_USER,  
        to=[to_email],
    )
    email.attach_alternative(html_content, "text/html")  
    email.send()
def send_welcome_email(user, activation_url):
    subject = "Welcome to Tiberbu!"
    to_email = user.email

    # Render HTML content
    html_content = render_to_string("email/welcome_email.html", {
        "user": user,
        "activation_url": activation_url,
    })

    # Send the email
    email = EmailMultiAlternatives(subject="Welcome to Tiberbu!", body=html_content, from_email=settings.EMAIL_HOST_USER, to=[to_email])
    email.attach_alternative(html_content, "text/html")
    email.send()
    
def send_login_email(user_email, username):
    subject = "Login Notification"
    message = f"Hello {username},\n\nYou have successfully logged into your account."
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user_email]

    send_mail(subject, message, from_email, recipient_list)
    
def send_speed_date_email(user, speed_date, base_url):
    """
    Sends an email to the creator with the link to their created SpeedDate.
    """
    subject = "Your Speed Date is Created!"
    to_email = user.email  # Creator's email

    # Generate the Speed Date URL dynamically
    speed_date_link = f"{base_url}/speeddate/{speed_date.id}"

    # Context for the email template
    context = {
        "user": user,
        "speed_date": speed_date,
        "speed_date_link": speed_date_link,
    }

    # Render HTML email content
    html_content = render_to_string("emails/speed_date_created.html", context)
    text_content = f"Hi {user.first_name},\n\nYour Speed Date has been created successfully!\nYou can access it here: {speed_date_link}"

    # Create and send the email
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.EMAIL_HOST_USER,
        to=[to_email],
    )
    email.attach_alternative(html_content, "text/html")  # Attach HTML version
    email.send()