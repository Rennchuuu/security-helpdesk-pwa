import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-root',
  standalone: true,  // Standalone component
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, CommonModule],  // Add CommonModule here
})
export class AppComponent {
  isAppInstalled = false;
  pushNotificationEnabled = false;
  isInstallPromptAvailable = false;
  installPromptEvent: any = null;

  // Method to handle the Install button click
  installApp() {
    if (this.isInstallPromptAvailable && this.installPromptEvent) {
      // Show the install prompt
      this.installPromptEvent.prompt();
      this.installPromptEvent.userChoice.then((choiceResult: any) => {
        this.isAppInstalled = choiceResult.outcome === 'accepted';
        this.installPromptEvent = null; // Reset the prompt event after use
      });
    }
  }

  // Method to toggle push notifications
  togglePushNotifications() {
    if (this.pushNotificationEnabled) {
      this.subscribeToPushNotifications();
    } else {
      this.unsubscribeFromPushNotifications();
    }
  }

  subscribeToPushNotifications() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlB64ToUint8Array('BJRpKqdtFxiOb4C6e6iYr57QeVy2Jso39u1oTbMoHf7yT6slJGN6ImDl1zpmFeT1Xj0zJLISz7xkhuhsF_mUKYU')  // Replace with your public key
        }).then((subscription) => {
          console.log('Subscribed to push notifications', subscription);
        }).catch((error) => {
          console.error('Push subscription failed', error);
        });
      });
    }
  }

  unsubscribeFromPushNotifications() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          if (subscription) {
            subscription.unsubscribe().then(() => {
              console.log('Unsubscribed from push notifications');
            }).catch((error) => {
              console.error('Unsubscribe failed', error);
            });
          }
        });
      });
    }
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        this.installPromptEvent = event;  // Save the event to use later
        this.isInstallPromptAvailable = true; // Show install button
      });
    }
  }

  urlB64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
