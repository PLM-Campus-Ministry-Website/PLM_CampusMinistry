// src/app/home/home.page.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { AlertController } from '@ionic/angular';

interface DailyQuote {
  text: string;
  author: string;
  explanation: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  // Scroll to top button visibility
  showScrollButton = false;
  
  // Daily Quote System
  currentQuote: DailyQuote = {
    text: '',
    author: '',
    explanation: ''
  };
  
  greeting: string = '';
  currentDate: string = '';
  currentDay: string = '';

  // 31 Catholic Saint Quotes with explanations
  private saintQuotes: DailyQuote[] = [
    {
      text: "Do not be afraid. Open wide the doors to Christ.",
      author: "St. John Paul II",
      explanation: "Embrace faith without fear. When we welcome Christ into our lives, we discover true freedom and purpose. Let courage guide your spiritual journey today."
    },
    {
      text: "Do small things with great love.",
      author: "St. Thérèse of Lisieux",
      explanation: "Every act of kindness matters. Transform ordinary moments into extraordinary gifts through love. Your smallest gestures can create the biggest impact on others."
    },
    {
      text: "You have made us for Yourself, O Lord, and our hearts are restless until they rest in You.",
      author: "St. Augustine of Hippo",
      explanation: "Our deepest longing is for God. No worldly achievement can satisfy the soul's hunger for divine love. Find your peace in the Creator who knows you completely."
    },
    {
      text: "Pray, hope, and don't worry. God is merciful and will hear your prayer.",
      author: "St. Padre Pio",
      explanation: "Release your anxieties to God's care. Prayer and hope are powerful weapons against worry. Trust that divine mercy is always listening to your heart's cry."
    },
    {
      text: "Be the living expression of God's kindness.",
      author: "St. Teresa of Calcutta (Mother Teresa)",
      explanation: "You are called to reflect God's love in action. Let compassion flow through your words and deeds. Be the hands and feet of Christ to those around you."
    },
    {
      text: "I prefer to die rather than commit sin.",
      author: "St. Dominic Savio",
      explanation: "Integrity is worth more than life itself. Stand firm in your values even when it's difficult. Your moral courage inspires others to choose what's right."
    },
    {
      text: "Start by doing what is necessary; then what is possible; and suddenly you are doing the impossible.",
      author: "St. Francis of Assisi",
      explanation: "Great achievements begin with small steps. Don't be overwhelmed by the journey ahead. Faith transforms possibility into reality one action at a time."
    },
    {
      text: "Be who God meant you to be and you will set the world on fire.",
      author: "St. Catherine of Siena",
      explanation: "Your authentic self is your greatest gift. Embrace your unique calling with passion and purpose. When you live fully as God intended, you become unstoppable."
    },
    {
      text: "The Cross is the school of love.",
      author: "St. Maximilian Kolbe",
      explanation: "Suffering teaches us the depth of divine love. Through challenges, we grow in compassion and understanding. The cross is not an end but a path to resurrection."
    },
    {
      text: "Viva Cristo Rey! (Long live Christ the King!)",
      author: "St. José Sánchez del Río",
      explanation: "Proclaim your faith boldly and joyfully. Christ reigns over all circumstances in your life. Let this truth be your strength in every battle you face."
    },
    {
      text: "The Lord has loved me so much: we must love everyone.",
      author: "St. Josephine Bakhita",
      explanation: "God's love for you overflows to others. Having experienced divine mercy, share it generously. Love without boundaries, just as you have been loved."
    },
    {
      text: "Go forth and set the world on fire.",
      author: "St. Ignatius of Loyola",
      explanation: "You are called to be a light in darkness. Your faith should ignite passion and hope wherever you go. Transform your world through bold, loving action."
    },
    {
      text: "Love God, serve God; everything is in that.",
      author: "St. Clare of Assisi",
      explanation: "Simplicity is the key to spiritual fulfillment. When we focus on loving and serving God, all else falls into place. Let this be your life's primary mission."
    },
    {
      text: "Prefer nothing whatever to Christ.",
      author: "St. Benedict of Nursia",
      explanation: "Make Christ the center of every decision. Nothing in this world should take priority over your relationship with Him. This focus brings clarity and peace."
    },
    {
      text: "Run, jump, shout, but do not sin.",
      author: "St. John Bosco",
      explanation: "Joyful living and holiness go hand in hand. Embrace life's pleasures while maintaining your integrity. God wants you to be happy and holy simultaneously."
    },
    {
      text: "I want to see you in heaven one day.",
      author: "St. Maria Goretti",
      explanation: "Our ultimate goal is eternal union with God. Keep heaven in your sights during earthly challenges. This perspective helps you choose love over harm always."
    },
    {
      text: "Let no one despise your youth.",
      author: "St. Paul the Apostle (1 Timothy 4:12)",
      explanation: "Age doesn't limit your impact for Christ. Your youth is a gift, not a disadvantage. Rise up and show the world what faithful young people can accomplish."
    },
    {
      text: "I am not afraid… I was born to do this.",
      author: "St. Joan of Arc",
      explanation: "Courage comes from knowing your divine purpose. God has prepared you for this moment. Step forward confidently into the calling placed on your life."
    },
    {
      text: "Let yourself be loved.",
      author: "St. Elizabeth of the Trinity",
      explanation: "Receiving God's love requires vulnerability. Open your heart to divine affection without resistance. You are worthy of the love freely offered to you."
    },
    {
      text: "Be who you are and be that well.",
      author: "St. Francis de Sales",
      explanation: "Authenticity is holiness in action. Don't waste energy pretending to be someone else. Excel at being the unique person God created you to be."
    },
    {
      text: "Mary is the safest, easiest, shortest, and most perfect way to Jesus.",
      author: "St. Louis de Montfort",
      explanation: "Through Mary, we find Christ more fully. Her maternal guidance leads us safely to her Son. Trust in her intercession on your spiritual journey."
    },
    {
      text: "Your God is ever beside you — indeed, He is even within you.",
      author: "St. Alphonsus Liguori",
      explanation: "God's presence is constant and intimate. You are never alone in your struggles or triumphs. The divine dwells in your very being—discover this truth."
    },
    {
      text: "Ignorance of Scripture is ignorance of Christ.",
      author: "St. Jerome",
      explanation: "Know God's Word to know God's heart. Scripture reveals Christ in profound ways. Make reading the Bible a priority in your spiritual growth."
    },
    {
      text: "God has created me to do Him some definite service.",
      author: "St. John Henry Newman",
      explanation: "Your life has divine purpose and meaning. God has a specific mission only you can fulfill. Discover and embrace the unique role prepared for you."
    },
    {
      text: "My job is to inform, not to convince.",
      author: "St. Bernadette Soubirous",
      explanation: "Share truth humbly and let God do the rest. You're called to witness, not to force belief. Speak your faith and trust the Spirit to work in hearts."
    },
    {
      text: "Actions speak louder than words.",
      author: "St. Anthony of Padua",
      explanation: "Live your faith through concrete deeds. Talk is easy, but genuine love requires action. Let your life be the most powerful sermon you ever preach."
    },
    {
      text: "Cheerfulness strengthens the heart and makes us persevere.",
      author: "St. Philip Neri",
      explanation: "Joy is a spiritual weapon against discouragement. A cheerful heart endures longer than a heavy one. Choose positivity as an act of faith and resistance."
    },
    {
      text: "Jesus, I trust in You.",
      author: "St. Faustina Kowalska",
      explanation: "Trust is the foundation of faith. Release control and place your confidence in divine mercy. These simple words can transform your entire life."
    },
    {
      text: "I am not my own; I give myself to Jesus.",
      author: "St. Kateri Tekakwitha",
      explanation: "True freedom comes through surrender to Christ. Giving yourself completely to God brings liberation. In losing yourself, you find your truest identity."
    },
    {
      text: "The things that we love tell us what we are.",
      author: "St. Thomas Aquinas",
      explanation: "Your passions reveal your character and values. What captures your heart shapes your destiny. Choose to love what is noble, true, and eternal."
    },
    {
      text: "Not me, but God.",
      author: "Bl. Carlo Acutis",
      explanation: "Humility directs all glory to the Creator. Your talents and successes are gifts to be used for God. Let your life point others toward heaven, not yourself."
    }
  ];
  
  // Form data model
  request = {
    name: '',
    college: '',
    dateTime: '',
    event: '',
    place: '',
    customPlace: '',
    attendees: 1,
    otherPlace: '',
    contactNumber: '',
    notes: ''
  };

  // FAQ visibility tracking
  visibleAnswers: { [key: number]: boolean } = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false
  };

  constructor(private alertCtrl: AlertController) {}

  ngOnInit() {
    this.setDailyQuote();
    this.setGreeting();
    this.setCurrentDate();
    this.setupScrollListener();
  }

  setupScrollListener() {
    setTimeout(() => {
      const content = document.querySelector('ion-content');
      if (content) {
        content.addEventListener('ionScroll', (event: any) => {
          this.showScrollButton = event.detail.scrollTop > 300;
        });
      }
    }, 100);
  }

  scrollToTop() {
    const content = document.querySelector('ion-content');
    if (content) {
      content.scrollToTop(500);
    }
  }

  // Set daily quote based on day of month
  setDailyQuote() {
    const today = new Date();
    const dayOfMonth = today.getDate(); // 1-31
    const quoteIndex = (dayOfMonth - 1) % this.saintQuotes.length; // 0-30
    this.currentQuote = this.saintQuotes[quoteIndex];
  }

  // Set greeting based on time of day
  setGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      this.greeting = 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      this.greeting = 'Good Evening';
    } else {
      this.greeting = 'Good Night';
    }
  }

  // Set current date and day
  setCurrentDate() {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    this.currentDate = today.toLocaleDateString('en-US', options);
    this.currentDay = today.toLocaleDateString('en-US', { weekday: 'long' });
  }

  // Form submission handler
  onSubmit() {
    if (this.request.name && this.request.college && this.request.event && this.request.dateTime && this.request.place) {
      const emailSubject = 'Mass Schedule Request';
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();
      const place = this.request.place === 'Other' && this.request.customPlace ? this.request.customPlace : this.request.place;
      const formattedDateTime = this.formatDateTime(this.request.dateTime);

      const emailBody = `
        Dear Ms. Angel Macasaet,

        I hope this email finds you well.

        I am writing to request the scheduling of a mass for the following details:

        College: ${this.request.college}
        Event: ${this.request.event}
        Date and Time: ${formattedDateTime}
        Number of Attendees: ${this.request.attendees}
        Place: ${place}
        Additional Notes: ${this.request.notes || 'None'}

        The request was made on: ${formattedDate}

        Kindly confirm the scheduled time at your earliest convenience.
        You can contact me on my phone number: ${this.request.contactNumber}

        Thank you for your time and attention to this matter.

        Sincerely,
        ${this.request.name}
      `;

      const mailToLink = `mailto:annie.macasaet1985@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailToLink;
      this.showConfirmationAlert();
    } else {
      this.showErrorAlert();
    }
  }

  showErrorAlert() {
    alert('Please fill out all required fields.');
  }

  showConfirmationAlert() {
    alert('Your request has been sent! Please check your email client.');
  }

  async openSearch() {
    const alert = await this.alertCtrl.create({
      header: 'Search',
      inputs: [
        {
          name: 'searchTerm',
          type: 'text',
          placeholder: 'Enter search term...',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Search',
          handler: (data) => {
            console.log('Searching for:', data.searchTerm);
          },
        },
      ],
    });

    await alert.present();
  }

  toggleAnswer(questionNumber: number) {
    this.visibleAnswers[questionNumber] = !this.visibleAnswers[questionNumber];
  }

  isAnswerVisible(questionNumber: number): boolean {
    return this.visibleAnswers[questionNumber];
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  }
}