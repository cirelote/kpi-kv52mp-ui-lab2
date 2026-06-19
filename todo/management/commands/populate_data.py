from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from todo.models import Task
import datetime

User = get_user_model()

class Command(BaseCommand):
    help = 'Populates the database with initial test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Populating data...')

        # Create user
        email = 'test@example.com'
        password = 'password123'
        if not User.objects.filter(email=email).exists():
            user = User.objects.create_user(
                email=email,
                password=password,
                name='Test User',
                gender='M',
                date_of_birth=datetime.date(1990, 1, 1)
            )
            self.stdout.write(self.style.SUCCESS(f'Created user: {email} / {password}'))
        else:
            user = User.objects.get(email=email)
            self.stdout.write(self.style.WARNING(f'User {email} already exists'))

        # Create tasks
        if not Task.objects.filter(user=user).exists():
            Task.objects.create(user=user, title='First Task', description='This is the first task.', is_completed=False)
            Task.objects.create(user=user, title='Completed Task', description='This task is already completed.', is_completed=True)
            self.stdout.write(self.style.SUCCESS('Created tasks for test user.'))
        else:
            self.stdout.write(self.style.WARNING('Tasks already exist for this user.'))

        self.stdout.write(self.style.SUCCESS('Data population complete!'))
