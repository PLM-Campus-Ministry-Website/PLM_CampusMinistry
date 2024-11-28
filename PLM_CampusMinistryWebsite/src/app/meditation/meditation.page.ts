import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meditation',
  templateUrl: './meditation.page.html',
  styleUrls: ['./meditation.page.scss'],
})
export class MeditationPage implements OnInit {
  isModalOpen: boolean = false; // Controls modal visibility
  modalTitle: string = '';      // Stores modal title
  modalDetails: string = '';    // Stores modal details

  constructor() { }

  ngOnInit() {
    // Initialization logic can go here
  }

  // Add the openSearch method
  openSearch() {
    console.log('Search button clicked');
    // You can add actual search functionality here if needed
  }

morningPrayer = `
  <span style='font-size:100px;'>&#127807;</span>
<p>Meditation is a practice where an individual uses a technique - such as mindfulness, or focusing the mind on a particular object, thought, or activity - to train attention and awareness, and achieve a mentally clear and emotionally calm and stable state.</p>
<p>It can also be a practice of quiet reflection and deep contemplation, focusing on God’s word and presence.</p>
<p>Meditation can involve sitting quietly, breathing deeply, and focusing on a word, phrase, or sensation. </p>
<p>We can meditate on scripture, internalize God's teachings and gain spiritual insights. This practice helps to cultivate a sense of peace, clarity, and inner strength, drawing one closer to God's love and wisdom.</p>
<p>Regular practice can lead to a deeper understanding of oneself and a stronger relationship with God.</p>
<p>Embrace this sacred time to reflect, pray, and find solace in His presence.</p>
<br><br><br><br><br>
`;
eveningPrayer = `
    <span style='font-size:100px;'>&#127807;</span>
<p>Meditation offers numerous benefits that contribute to overall well-being.</p>
<p>It offers a profound way to deepen one’s relationship with God. By setting aside time for quiet reflection and prayer, believers can experience a sense of peace and clarity that transcends daily distractions.
<p>This practice helps to cultivate a mindful presence, allowing individuals to become more attuned to the voice of God and His guidance in their lives.</p>
<p>The benefits of Christian meditation include reduced stress and anxiety, as it encourages resting in God's presence and trusting in His plan. It enhances emotional well-being by fostering a heart of gratitude and contentment through contemplation of God’s blessings.</p>
<p>Meditation also boosts emotional health by increasing self-awareness and fostering a positive outlook on life.</p>
<p>Physically, it can promote relaxation and improve overall health. Spiritually, it strengthens faith, reinforces the teachings of Scripture, and provides a foundation for a deeper, more intimate connection with God.</p>
<p>Embracing the practice of meditation can lead to a more balanced, joyful, and spiritually enriched life.</p>
<br><br><br>
`;

thanksgivingPrayer = `
  <span style='font-size:100px;'>&#127807;</span>
<p>Breathing exercises are simple techniques designed to improve the way you breathe, enhance your lung capacity, and promote relaxation.</p>
<p>They involve consciously regulating your breathing patterns to achieve a state of calm and focus.
<p>These exercises can help reduce stress, lower blood pressure, and improve overall respiratory health.</p>
<p>Common techniques include diaphragmatic breathing, where you breathe deeply into your abdomen, and box breathing, which involves inhaling, holding, exhaling, and pausing for equal counts.</p>
<p>Breathing exercises can also increase mindfulness, helping you stay present and aware of your body and surroundings.</p>
<p>Incorporating these exercises into your daily routine can lead to better physical health and mental well-being.</p>
<br><br><br><br><br>
`;

  // Opens the modal with specific prayer details
  openModal(title: string, details: string): void {
    this.modalTitle = title;
    this.modalDetails = details;
    this.isModalOpen = true;
  }

  // Closes the modal
  closeModal(): void {
    this.isModalOpen = false;
    this.modalTitle = '';
    this.modalDetails = '';
  }

}

