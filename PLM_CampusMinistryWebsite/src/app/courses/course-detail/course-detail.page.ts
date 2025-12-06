import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../certificate.service';
import { ScoreboardService } from '../scoreboard.service';
import { AlertController } from '@ionic/angular';

export interface Lesson {
  id: number;
  title: string;
  content: string;
  questions: Question[];
  completed: boolean;
}

export interface Question {
  id: number;
  type: 'multiple-choice' | 'fill-blank' | 'true-false' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | number | string[] | boolean;
  userAnswer?: string | number | string[] | boolean;
  isCorrect?: boolean;
  explanation?: string;
  isCompleted?: boolean; // Track if this question was answered correctly
}

export interface CourseProgress {
  courseId: number;
  currentLesson: number;
  lessonsCompleted: number[];
  totalXP: number;
  streak: number;
  lastStudyDate: string;
}

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.page.html',
  styleUrls: ['./course-detail.page.scss'],
})
export class CourseDetailPage implements OnInit {
  courseId: number = 1;
  currentLessonIndex: number = 0;
  currentQuestionIndex: number = 0;
  progress: CourseProgress | null = null;
  showResult: boolean = false;
  xpGained: number = 0;
  streakBonus: number = 0;
  hasStartedLesson: boolean = false;

  lessons: Lesson[] = [];

  private getCourse1Lessons(): Lesson[] {
    return [
    {
      id: 1,
      title: 'What Is the Catholic Faith?',
      content: `The word "Catholic" comes from the Greek word "katholikos," meaning "universal" or "according to the whole." The Catholic Church is the largest Christian denomination, with over 1.3 billion members worldwide. Catholicism is distinct from other Christian traditions in its emphasis on:
      
• Sacred Tradition alongside Scripture
• The authority of the Pope and bishops
• The seven sacraments
• The real presence of Christ in the Eucharist
• Devotion to Mary and the saints

The Church's mission is to spread the Gospel, celebrate the sacraments, and serve the poor and marginalized.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What does the word "Catholic" mean?',
          options: ['Universal', 'Roman', 'Ancient', 'Traditional'],
          correctAnswer: 0,
          explanation: '"Catholic" comes from the Greek word "katholikos," meaning "universal" or "according to the whole."'
        },
        {
          id: 2,
          type: 'true-false',
          question: 'Catholicism is the largest Christian denomination in the world.',
          correctAnswer: true,
          explanation: 'Yes! The Catholic Church has over 1.3 billion members worldwide.'
        },
        {
          id: 3,
          type: 'fill-blank',
          question: 'The Catholic Church emphasizes both Sacred _____ and Scripture.',
          correctAnswer: 'Tradition',
          explanation: 'Catholics believe in both Sacred Scripture (the Bible) and Sacred Tradition as sources of divine revelation.'
        }
      ],
      completed: false
    },
    {
      id: 2,
      title: 'Who Is Jesus Christ?',
      content: `Jesus Christ is the central figure of Christianity. Catholics believe that Jesus is:
      
• True God: The second Person of the Holy Trinity, fully divine
• True Man: Born of the Virgin Mary, fully human
• Savior: Through his death and resurrection, he saved humanity from sin
• Lord: He is the master and teacher of all Christians

Jesus' life, ministry, death, and resurrection are recorded in the four Gospels. His teachings, miracles, and ultimate sacrifice on the cross demonstrate God's infinite love for humanity.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'Catholics believe Jesus is:',
          options: ['Only God', 'Only human', 'True God and true Man', 'A prophet'],
          correctAnswer: 2,
          explanation: 'Catholics believe Jesus is both fully divine (true God) and fully human (true Man).'
        },
        {
          id: 2,
          type: 'fill-blank',
          question: 'Through his death and _____, Jesus saved humanity from sin.',
          correctAnswer: 'resurrection',
          explanation: 'Jesus\' resurrection from the dead is the cornerstone of Christian faith and the source of our salvation.'
        },
        {
          id: 3,
          type: 'true-false',
          question: 'Jesus\' life and teachings are recorded in the four Gospels.',
          correctAnswer: true,
          explanation: 'Yes! The Gospels of Matthew, Mark, Luke, and John record Jesus\' life, teachings, and miracles.'
        }
      ],
      completed: false
    },
    {
      id: 3,
      title: 'God and the Holy Trinity',
      content: `The Holy Trinity is one of the central mysteries of the Catholic faith. Catholics believe in:
      
• One God in three Persons: Father, Son, and Holy Spirit
• Each Person is fully God, yet they are distinct
• They are equal in divinity and work together in perfect unity

The Father creates, the Son redeems, and the Holy Spirit sanctifies. This relationship of love within the Trinity is the model for all Christian relationships.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'How many Persons are in the Holy Trinity?',
          options: ['One', 'Two', 'Three', 'Four'],
          correctAnswer: 2,
          explanation: 'The Holy Trinity consists of three Persons: Father, Son, and Holy Spirit.'
        },
        {
          id: 2,
          type: 'fill-blank',
          question: 'The Father _____, the Son redeems, and the Holy Spirit sanctifies.',
          correctAnswer: 'creates',
          explanation: 'Each Person of the Trinity has a distinct role: the Father creates, the Son redeems, and the Holy Spirit sanctifies.'
        },
        {
          id: 3,
          type: 'true-false',
          question: 'The three Persons of the Trinity are equal in divinity.',
          correctAnswer: true,
          explanation: 'Yes! All three Persons are fully God and equal in divinity, though distinct in their relationships.'
        }
      ],
      completed: false
    },
    {
      id: 4,
      title: 'Divine Revelation: How God Speaks to Us',
      content: `God reveals himself to humanity through Divine Revelation, which comes in two forms:
      
• Sacred Scripture: The written Word of God (the Bible)
• Sacred Tradition: The living transmission of the faith through the Church

The Magisterium (the teaching authority of the Church, including the Pope and bishops) interprets and preserves both Scripture and Tradition, ensuring the faith is passed down correctly through the ages.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What are the two forms of Divine Revelation?',
          options: ['Scripture and Tradition', 'Old and New Testaments', 'Prayer and Sacraments', 'Pope and Bishops'],
          correctAnswer: 0,
          explanation: 'Divine Revelation comes through both Sacred Scripture and Sacred Tradition.'
        },
        {
          id: 2,
          type: 'fill-blank',
          question: 'The _____ is the teaching authority of the Church, including the Pope and bishops.',
          correctAnswer: 'Magisterium',
          explanation: 'The Magisterium interprets and preserves both Scripture and Tradition.'
        },
        {
          id: 3,
          type: 'true-false',
          question: 'Sacred Tradition is less important than Sacred Scripture.',
          correctAnswer: false,
          explanation: 'Both Sacred Scripture and Sacred Tradition are equally important sources of Divine Revelation.'
        }
      ],
      completed: false
    },
    {
      id: 5,
      title: 'The Bible and How Catholics Use It',
      content: `The Catholic Bible contains 73 books (compared to 66 in Protestant Bibles), including:
      
• Old Testament: 46 books (includes deuterocanonical books like Tobit, Judith, Wisdom, etc.)
• New Testament: 27 books (Gospels, Acts, Letters, Revelation)

Catholics read Scripture within the context of the Church's Tradition and the Magisterium's interpretation. The Bible is not meant to be read in isolation but as part of the living faith of the Church.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'How many books are in the Catholic Bible?',
          options: ['66', '70', '73', '80'],
          correctAnswer: 2,
          explanation: 'The Catholic Bible contains 73 books, including the deuterocanonical books.'
        },
        {
          id: 2,
          type: 'true-false',
          question: 'Catholics read Scripture in isolation from Church Tradition.',
          correctAnswer: false,
          explanation: 'Catholics read Scripture within the context of the Church\'s Tradition and the Magisterium\'s interpretation.'
        },
        {
          id: 3,
          type: 'fill-blank',
          question: 'The Catholic Old Testament has _____ books, including deuterocanonical books.',
          correctAnswer: '46',
          explanation: 'The Catholic Old Testament contains 46 books, including books like Tobit, Judith, and Wisdom.'
        }
      ],
      completed: false
    },
    {
      id: 6,
      title: 'The Church: Founded by Christ',
      content: `Jesus Christ founded the Catholic Church and gave it four essential marks:
      
• One: United in faith, worship, and governance
• Holy: Set apart for God, though made up of sinners
• Catholic: Universal, for all people in all places
• Apostolic: Founded on the apostles and their successors

The Pope (successor of St. Peter) and bishops (successors of the apostles) lead the Church. Community is essential because faith is meant to be lived together, not in isolation.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What are the four marks of the Church?',
          options: ['One, Holy, Catholic, Apostolic', 'Faith, Hope, Love, Charity', 'Father, Son, Holy Spirit', 'Scripture, Tradition, Magisterium'],
          correctAnswer: 0,
          explanation: 'The four marks of the Church are: One, Holy, Catholic, and Apostolic.'
        },
        {
          id: 2,
          type: 'fill-blank',
          question: 'The Pope is the successor of St. _____.',
          correctAnswer: 'Peter',
          explanation: 'The Pope is the successor of St. Peter, the first leader of the Church.'
        },
        {
          id: 3,
          type: 'true-false',
          question: 'Faith is meant to be lived in isolation.',
          correctAnswer: false,
          explanation: 'Community is essential because faith is meant to be lived together, not in isolation.'
        }
      ],
      completed: false
    },
    {
      id: 7,
      title: 'The Sacraments: God\'s Gifts of Grace',
      content: `Sacraments are visible signs of invisible grace instituted by Christ. The Catholic Church has seven sacraments:
      
1. Baptism: Entry into the Church, removes original sin
2. Confirmation: Strengthens with the Holy Spirit
3. Eucharist: The Body and Blood of Christ
4. Reconciliation: Forgiveness of sins
5. Anointing of the Sick: Healing and comfort
6. Matrimony: Holy marriage
7. Holy Orders: Ordination to priesthood

Sacraments help us grow spiritually and receive God's grace.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'How many sacraments are there in the Catholic Church?',
          options: ['Five', 'Six', 'Seven', 'Ten'],
          correctAnswer: 2,
          explanation: 'The Catholic Church has seven sacraments instituted by Christ.'
        },
        {
          id: 2,
          type: 'fill-blank',
          question: '_____ is the sacrament that removes original sin and brings us into the Church.',
          correctAnswer: 'Baptism',
          explanation: 'Baptism is the first sacrament and entry into the Catholic Church.'
        },
        {
          id: 3,
          type: 'multiple-choice',
          question: 'Which sacrament is described as "The Body and Blood of Christ"?',
          options: ['Baptism', 'Confirmation', 'Eucharist', 'Reconciliation'],
          correctAnswer: 2,
          explanation: 'The Eucharist is the sacrament where bread and wine become the Body and Blood of Christ.'
        }
      ],
      completed: false
    },
    {
      id: 8,
      title: 'The Holy Mass',
      content: `The Mass is the central act of Catholic worship, consisting of two main parts:
      
• Liturgy of the Word: Readings from Scripture, homily, prayers
• Liturgy of the Eucharist: Consecration of bread and wine into the Body and Blood of Christ

Sunday Mass is essential because it's the day of the Lord's resurrection. Catholics believe in the Real Presence: the bread and wine truly become the Body and Blood of Jesus Christ, not just symbols.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What are the two main parts of the Mass?',
          options: ['Old and New Testaments', 'Liturgy of the Word and Liturgy of the Eucharist', 'Prayer and Sacrifice', 'Reading and Communion'],
          correctAnswer: 1,
          explanation: 'The Mass consists of the Liturgy of the Word and the Liturgy of the Eucharist.'
        },
        {
          id: 2,
          type: 'true-false',
          question: 'Catholics believe the bread and wine are only symbols of Christ.',
          correctAnswer: false,
          explanation: 'Catholics believe in the Real Presence: the bread and wine truly become the Body and Blood of Christ.'
        },
        {
          id: 3,
          type: 'fill-blank',
          question: 'Sunday Mass is essential because it\'s the day of the Lord\'s _____.',
          correctAnswer: 'resurrection',
          explanation: 'Sunday commemorates the day of the Lord\'s resurrection from the dead.'
        }
      ],
      completed: false
    },
    {
      id: 9,
      title: 'Basic Catholic Moral Teachings',
      content: `Catholic moral teaching is based on:
      
• Human dignity: Every person is made in God's image
• The Ten Commandments: God's fundamental moral law
• The Beatitudes: Jesus' teachings on true happiness
• Sin: Mortal (serious, breaks relationship with God) and venial (less serious)
• Grace: God's free gift that helps us live morally
• Forgiveness: Available through the sacrament of Reconciliation

Living morally means loving God and neighbor as ourselves.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What are the two types of sin?',
          options: ['Big and small', 'Mortal and venial', 'Serious and minor', 'Major and minor'],
          correctAnswer: 1,
          explanation: 'The two types of sin are mortal (serious) and venial (less serious).'
        },
        {
          id: 2,
          type: 'fill-blank',
          question: 'Every person is made in God\'s _____, giving them inherent dignity.',
          correctAnswer: 'image',
          explanation: 'Human dignity comes from being made in the image and likeness of God.'
        },
        {
          id: 3,
          type: 'true-false',
          question: 'The Beatitudes are Jesus\' teachings on true happiness.',
          correctAnswer: true,
          explanation: 'Yes! The Beatitudes (from the Sermon on the Mount) teach us about true happiness and blessedness.'
        }
      ],
      completed: false
    },
    {
      id: 10,
      title: 'Christian Prayer and Spiritual Life',
      content: `Prayer is communication with God. Types of prayer include:
      
• Adoration: Praising God for who he is
• Petition: Asking for what we need
• Thanksgiving: Thanking God for blessings
• Contrition: Asking for forgiveness

The Our Father (Lord's Prayer) is the perfect prayer taught by Jesus. Devotions like the Rosary, Eucharistic Adoration, and novenas help deepen our relationship with God.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What is the perfect prayer taught by Jesus?',
          options: ['Hail Mary', 'Our Father', 'Glory Be', 'Apostles\' Creed'],
          correctAnswer: 1,
          explanation: 'The Our Father (Lord\'s Prayer) is the perfect prayer that Jesus taught his disciples.'
        },
        {
          id: 2,
          type: 'fill-blank',
          question: 'Prayer is _____ with God.',
          correctAnswer: 'communication',
          explanation: 'Prayer is our way of communicating with God, speaking to him and listening to him.'
        },
        {
          id: 3,
          type: 'true-false',
          question: 'The Rosary is a popular Catholic devotion.',
          correctAnswer: true,
          explanation: 'Yes! The Rosary is one of the most popular Catholic devotions, involving meditation on the mysteries of Christ\'s life.'
        }
      ],
      completed: false
    },
    {
      id: 11,
      title: 'The Blessed Virgin Mary and the Saints',
      content: `Mary, the Mother of Jesus, has a unique role in salvation:
      
• She said "yes" to God's plan (the Annunciation)
• She is the Mother of God (Theotokos)
• She is a model of faith and obedience
• Catholics venerate (honor) Mary, but worship only God

Saints are holy men and women who lived exemplary Christian lives. The Communion of Saints includes all believers—those in heaven, purgatory, and on earth—united in Christ.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What is Mary\'s unique title meaning "Mother of God"?',
          options: ['Immaculate Conception', 'Theotokos', 'Queen of Heaven', 'Our Lady'],
          correctAnswer: 1,
          explanation: 'Theotokos is the Greek title meaning "God-bearer" or "Mother of God."'
        },
        {
          id: 2,
          type: 'true-false',
          question: 'Catholics worship Mary.',
          correctAnswer: false,
          explanation: 'Catholics venerate (honor) Mary, but worship only God. Worship (latria) is reserved for God alone.'
        },
        {
          id: 3,
          type: 'fill-blank',
          question: 'The _____ of Saints includes all believers in heaven, purgatory, and on earth.',
          correctAnswer: 'Communion',
          explanation: 'The Communion of Saints is the spiritual union of all believers, living and dead, in Christ.'
        }
      ],
      completed: false
    },
    {
      id: 12,
      title: 'Catholic Life and Mission',
      content: `Living as a Catholic disciple means:
      
• Following Jesus' example in daily life
• Performing works of mercy (feeding the hungry, visiting the sick, etc.)
• Evangelizing: Sharing the Good News with others
• Serving others, especially the poor and marginalized
• Answering the universal call to holiness

Every Catholic is called to be a missionary disciple, bringing Christ's love to the world through words and actions.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What is the universal call for all Catholics?',
          options: ['To become priests', 'To be holy', 'To be perfect', 'To be rich'],
          correctAnswer: 1,
          explanation: 'All Catholics are called to holiness, to become saints in their everyday lives.'
        },
        {
          id: 2,
          type: 'fill-blank',
          question: 'Every Catholic is called to be a _____ disciple.',
          correctAnswer: 'missionary',
          explanation: 'Every Catholic is called to be a missionary disciple, sharing Christ\'s love with others.'
        },
        {
          id: 3,
          type: 'true-false',
          question: 'Works of mercy include feeding the hungry and visiting the sick.',
          correctAnswer: true,
          explanation: 'Yes! Works of mercy are concrete ways to serve others, including feeding the hungry, visiting the sick, and caring for the poor.'
        }
      ],
      completed: false
    },
    {
      id: 13,
      title: 'The Last Things (Eschatology)',
      content: `Catholic teaching on the "last things" includes:
      
• Death: The separation of soul from body
• Particular Judgment: Individual judgment at death
• Heaven: Eternal union with God
• Hell: Eternal separation from God (for those who reject him)
• Purgatory: Purification for those who die in God's friendship but need cleansing

Christian hope is based on the promise of eternal life with God. Death is not the end but a transition to eternal life.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What happens to those who die in God\'s friendship but need purification?',
          options: ['Heaven', 'Hell', 'Purgatory', 'Limbo'],
          correctAnswer: 2,
          explanation: 'Purgatory is a state of purification for those who die in God\'s friendship but need to be cleansed of sin.'
        },
        {
          id: 2,
          type: 'true-false',
          question: 'Death is the end of existence.',
          correctAnswer: false,
          explanation: 'For Christians, death is not the end but a transition to eternal life with God.'
        },
        {
          id: 3,
          type: 'fill-blank',
          question: 'Heaven is eternal _____ with God.',
          correctAnswer: 'union',
          explanation: 'Heaven is the state of eternal union and perfect happiness with God.'
        }
      ],
      completed: false
    },
    {
      id: 14,
      title: 'Summary and Invitation',
      content: `Key points of the Catholic faith:
      
• Jesus Christ is the center of our faith
• The Church is the Body of Christ on earth
• The sacraments are channels of God's grace
• Prayer and service are essential to Christian life
• We are called to holiness and mission

Faith is a lifelong journey! Consider:
• RCIA (Rite of Christian Initiation for Adults)
• Catechism classes
• Receiving the sacraments
• Joining a faith community
• Daily prayer and Scripture reading

Welcome to the journey of faith!`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What is the center of the Catholic faith?',
          options: ['The Pope', 'The Church', 'Jesus Christ', 'The Bible'],
          correctAnswer: 2,
          explanation: 'Jesus Christ is the center and foundation of the Catholic faith.'
        },
        {
          id: 2,
          type: 'true-false',
          question: 'Faith is a lifelong journey.',
          correctAnswer: true,
          explanation: 'Yes! Faith is not a one-time event but a lifelong journey of growing closer to God.'
        },
        {
          id: 3,
          type: 'fill-blank',
          question: 'RCIA stands for Rite of Christian _____ for Adults.',
          correctAnswer: 'Initiation',
          explanation: 'RCIA (Rite of Christian Initiation for Adults) is the process for adults to become Catholic.'
        }
      ],
      completed: false
    }
    ];
  }

  private getCourse2Lessons(): Lesson[] {
    return [
      {
        id: 1,
        title: 'Introduction to the Holy Mass',
        content: `The Holy Mass is the central act of worship in the Catholic Church. It is:

• The re-presentation of Christ's sacrifice on the cross
• A sacred meal where we receive the Body and Blood of Christ
• The highest form of worship we can offer to God
• Rooted in Scripture, especially the Last Supper accounts

Catholics attend Mass because it is our duty and privilege to worship God together as a community. The Mass connects us to the sacrifice of Jesus and nourishes us spiritually.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is the Holy Mass?',
            options: ['A prayer service', 'The central act of worship in the Catholic Church', 'A Bible study', 'A social gathering'],
            correctAnswer: 1,
            explanation: 'The Holy Mass is the central act of worship in the Catholic Church, where we participate in Christ\'s sacrifice and receive the Eucharist.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'The Mass is the highest form of worship Catholics can offer to God.',
            correctAnswer: true,
            explanation: 'Yes! The Mass is the highest form of worship because it re-presents Christ\'s sacrifice on the cross.'
          },
          {
            id: 3,
            type: 'fill-blank',
            question: 'The Mass is rooted in Scripture, especially the _____ accounts.',
            correctAnswer: 'Last Supper',
            explanation: 'The Mass finds its origin in the Last Supper, where Jesus instituted the Eucharist.'
          }
        ],
        completed: false
      },
      {
        id: 2,
        title: 'The Mass as Sacrifice, Meal, and Memorial',
        content: `The Mass has three essential dimensions:

• Sacrifice: The Mass re-presents (makes present again) Christ's sacrifice on Calvary. It is not a new sacrifice, but the same one sacrifice of Christ made present to us.

• Meal: The Eucharist is spiritual nourishment. We receive the Body and Blood of Christ to strengthen us for our Christian journey.

• Memorial (Anamnesis): The Mass is a memorial in the biblical sense - not just remembering, but making present the saving events of Christ's life, death, and resurrection.

The Eucharist is called the "source and summit" of Christian life because it is both where we draw our strength from and the goal toward which all our Christian activities point.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What does it mean that the Mass "re-presents" Christ\'s sacrifice?',
            options: ['It creates a new sacrifice', 'It makes present again the same sacrifice of Christ', 'It is only a symbol', 'It replaces the original sacrifice'],
            correctAnswer: 1,
            explanation: 'The Mass re-presents (makes present again) the same one sacrifice of Christ on Calvary, not a new sacrifice.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The Eucharist is called the "source and _____" of Christian life.',
            correctAnswer: 'summit',
            explanation: 'The Eucharist is both the source (where we draw strength) and summit (the goal) of Christian life.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Mass is only a memorial in the sense of remembering past events.',
            correctAnswer: false,
            explanation: 'The Mass is a memorial (anamnesis) in the biblical sense - it makes present the saving events, not just remembers them.'
          }
        ],
        completed: false
      },
      {
        id: 3,
        title: 'Structure of the Mass: Introductory Rites',
        content: `The Mass begins with the Introductory Rites, which prepare us for worship:

• Sign of the Cross: We begin in the name of the Father, Son, and Holy Spirit
• Greeting: The priest greets the assembly with "The Lord be with you"
• Penitential Act: We acknowledge our sins and ask for God's mercy
• Gloria: A hymn of praise (omitted during Advent and Lent)
• Opening Prayer (Collect): The priest collects our intentions and offers them to God

These rites help us transition from our daily lives into the sacred time of the Mass.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'When is the Gloria omitted?',
            options: ['During Christmas', 'During Advent and Lent', 'On Sundays', 'Never'],
            correctAnswer: 1,
            explanation: 'The Gloria is omitted during Advent and Lent as a sign of penance and preparation.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The _____ Act helps us acknowledge our sins and ask for God\'s mercy.',
            correctAnswer: 'Penitential',
            explanation: 'The Penitential Act is when we confess our sins and ask for God\'s mercy before continuing with Mass.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Introductory Rites prepare us for worship.',
            correctAnswer: true,
            explanation: 'Yes! The Introductory Rites help us transition from daily life into the sacred time of Mass.'
          }
        ],
        completed: false
      },
      {
        id: 4,
        title: 'Structure of the Mass: Liturgy of the Word',
        content: `The Liturgy of the Word is when God speaks to us through Scripture:

• First Reading: Usually from the Old Testament
• Responsorial Psalm: We respond to God's word with a psalm
• Second Reading: From the New Testament letters (on Sundays and solemnities)
• Gospel Acclamation: "Alleluia" (except during Lent)
• Gospel Reading: The high point - we stand to hear Christ's words
• Homily: The priest or deacon explains and applies the readings
• Profession of Faith (Creed): We proclaim what we believe
• Prayers of the Faithful: We pray for the needs of the Church and world

Through the readings, God speaks to us and calls us to conversion.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is the high point of the Liturgy of the Word?',
            options: ['First Reading', 'Responsorial Psalm', 'Gospel Reading', 'Homily'],
            correctAnswer: 2,
            explanation: 'The Gospel Reading is the high point because it contains the words of Christ himself.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'We stand during the Gospel reading to show reverence.',
            correctAnswer: true,
            explanation: 'Yes! Standing during the Gospel shows special reverence for Christ\'s words.'
          },
          {
            id: 3,
            type: 'fill-blank',
            question: 'The _____ of Faith (Creed) is when we proclaim what we believe.',
            correctAnswer: 'Profession',
            explanation: 'The Profession of Faith (Creed) is when we publicly declare our beliefs as Catholics.'
          }
        ],
        completed: false
      },
      {
        id: 5,
        title: 'Structure of the Mass: Liturgy of the Eucharist - Part 1',
        content: `The Liturgy of the Eucharist is the heart of the Mass:

• Preparation of the Gifts (Offertory): We bring forward bread and wine, symbols of our lives
• Eucharistic Prayer: The most sacred part of the Mass
  - Preface: Thanksgiving to God
  - Sanctus (Holy, Holy, Holy): We join the angels in praise
  - Consecration: The bread and wine become the Body and Blood of Christ
  - Mystery of Faith: We proclaim the mystery we celebrate
  - Doxology and Great Amen: We give glory to God

During the Consecration, the priest speaks the words of Christ: "This is my Body" and "This is my Blood."`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What happens during the Consecration?',
            options: ['The bread and wine are blessed', 'The bread and wine become the Body and Blood of Christ', 'We remember the Last Supper', 'The priest gives a blessing'],
            correctAnswer: 1,
            explanation: 'During the Consecration, through the power of the Holy Spirit and the words of Christ, the bread and wine truly become the Body and Blood of Christ.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The _____ (Holy, Holy, Holy) is when we join the angels in praise.',
            correctAnswer: 'Sanctus',
            explanation: 'The Sanctus is the hymn "Holy, Holy, Holy" where we join the angels and saints in praising God.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Eucharistic Prayer is the most sacred part of the Mass.',
            correctAnswer: true,
            explanation: 'Yes! The Eucharistic Prayer is the most sacred part because it is when the consecration takes place.'
          }
        ],
        completed: false
      },
      {
        id: 6,
        title: 'Structure of the Mass: Liturgy of the Eucharist - Part 2',
        content: `After the Eucharistic Prayer comes the Communion Rite:

• The Lord's Prayer: We pray as Jesus taught us
• Sign of Peace: We offer peace to those around us
• Lamb of God: We acknowledge Christ as the Lamb who takes away sin
• Communion: We receive the Body and Blood of Christ
• Period of Silence: We give thanks after receiving

Receiving Communion unites us with Christ and with all the faithful. We should receive with reverence and faith.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What do we do after receiving Communion?',
            options: ['Leave immediately', 'Have a period of silence and thanksgiving', 'Talk to neighbors', 'Read the bulletin'],
            correctAnswer: 1,
            explanation: 'After receiving Communion, we should have a period of silence to give thanks and pray.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'The Sign of Peace is when we offer peace to those around us.',
            correctAnswer: true,
            explanation: 'Yes! The Sign of Peace is a gesture of reconciliation and unity before receiving Communion.'
          },
          {
            id: 3,
            type: 'fill-blank',
            question: 'The "_____ of God" acknowledges Christ as the Lamb who takes away sin.',
            correctAnswer: 'Lamb',
            explanation: 'The "Lamb of God" prayer acknowledges Jesus as the sacrificial lamb who takes away the sins of the world.'
          }
        ],
        completed: false
      },
      {
        id: 7,
        title: 'Structure of the Mass: Concluding Rites',
        content: `The Mass concludes with:

• Final Blessing: The priest blesses the assembly in the name of the Trinity
• Dismissal: "Go in peace, glorifying the Lord by your life" or similar words

The dismissal sends us forth to live what we have celebrated - to be Christ's presence in the world. The word "Mass" comes from the Latin "missa," meaning "sent" or "dismissed."`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What does the word "Mass" mean?',
            options: ['Meal', 'Prayer', 'Sent or Dismissed', 'Worship'],
            correctAnswer: 2,
            explanation: 'The word "Mass" comes from the Latin "missa," meaning "sent" or "dismissed," referring to the dismissal at the end.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'The dismissal sends us forth to be Christ\'s presence in the world.',
            correctAnswer: true,
            explanation: 'Yes! The dismissal sends us out to live what we have celebrated and be Christ\'s presence in the world.'
          },
          {
            id: 3,
            type: 'fill-blank',
            question: 'The Final _____ is given in the name of the Trinity.',
            correctAnswer: 'Blessing',
            explanation: 'The Final Blessing is given by the priest in the name of the Father, Son, and Holy Spirit.'
          }
        ],
        completed: false
      },
      {
        id: 8,
        title: 'The Eucharist and the Real Presence',
        content: `Catholics believe in the Real Presence: the bread and wine truly become the Body and Blood of Christ.

• Transubstantiation: The substance (what it really is) changes, while the accidents (appearance) remain. The bread and wine become Christ's Body and Blood, even though they still look like bread and wine.

• Scriptural Basis: Jesus said, "This is my Body" and "This is my Blood" (Matthew 26:26-28). In John 6, Jesus insists that we must eat his flesh and drink his blood.

• Not a Symbol: The Eucharist is not just a symbol or reminder - it is truly Christ himself, body, blood, soul, and divinity.

This is why we genuflect before the tabernacle and show great reverence to the Eucharist.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is transubstantiation?',
            options: ['A symbol', 'The change of substance while accidents remain', 'A memory', 'A blessing'],
            correctAnswer: 1,
            explanation: 'Transubstantiation is when the substance (what it really is) changes to become Christ\'s Body and Blood, while the appearance (accidents) remains as bread and wine.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'The Eucharist is just a symbol of Christ.',
            correctAnswer: false,
            explanation: 'No! The Eucharist is not a symbol - it is truly Christ himself, body, blood, soul, and divinity.'
          },
          {
            id: 3,
            type: 'fill-blank',
            question: 'In John 6, Jesus insists that we must eat his _____ and drink his blood.',
            correctAnswer: 'flesh',
            explanation: 'In John 6, Jesus clearly states that we must eat his flesh and drink his blood to have eternal life.'
          }
        ],
        completed: false
      },
      {
        id: 9,
        title: 'Sacred Signs and Symbols in the Mass',
        content: `Many sacred signs and symbols enrich the Mass:

• The Altar: Represents Christ and the table of the Last Supper
• Tabernacle: Where the Eucharist is reserved for adoration and Communion for the sick
• Ambo: The lectern from which the Word of God is proclaimed
• Vestments and Colors: Different colors for different seasons (white, red, green, purple, rose)
• Chalice and Paten: Sacred vessels for the Body and Blood of Christ
• Gestures: Standing (reverence), sitting (listening), kneeling (adoration)
• Incense, Candles, Holy Water: Signs of prayer, Christ's light, and purification

These signs help us enter more deeply into the mystery of the Mass.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What does the altar represent?',
            options: ['A table', 'Christ and the table of the Last Supper', 'A platform', 'Decoration'],
            correctAnswer: 1,
            explanation: 'The altar represents both Christ (the sacrifice) and the table of the Last Supper (the meal).'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The _____ is the lectern from which the Word of God is proclaimed.',
            correctAnswer: 'Ambo',
            explanation: 'The Ambo (or lectern) is the special place from which the readings and Gospel are proclaimed.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Different colors of vestments are used for different liturgical seasons.',
            correctAnswer: true,
            explanation: 'Yes! White (joy), red (martyrdom/Holy Spirit), green (Ordinary Time), purple (penance), and rose (Gaudete/Laetare Sundays) are used.'
          }
        ],
        completed: false
      },
      {
        id: 10,
        title: 'Roles in the Celebration of the Mass',
        content: `Different people have different roles in the Mass:

• Priest: Acts "in persona Christi" (in the person of Christ) - only he can consecrate the Eucharist
• Deacon: Assists the priest, can preach, and helps with Communion
• Lectors: Proclaim the readings (except the Gospel)
• Extraordinary Ministers of Holy Communion: Assist in distributing Communion when needed
• Altar Servers: Assist at the altar
• Choir and Music Ministry: Lead the assembly in song
• The Assembly: All the faithful actively participate through responses, singing, and prayer

Everyone has an important role - the Mass is not a spectator sport!`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'Who can consecrate the Eucharist?',
            options: ['Any baptized person', 'Only the priest', 'The deacon', 'The bishop only'],
            correctAnswer: 1,
            explanation: 'Only an ordained priest (or bishop) can consecrate the Eucharist, acting in persona Christi (in the person of Christ).'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'The Mass is a spectator event where we just watch.',
            correctAnswer: false,
            explanation: 'No! The Mass requires active participation from everyone - through responses, singing, and prayer.'
          },
          {
            id: 3,
            type: 'fill-blank',
            question: 'The priest acts "in persona _____" (in the person of Christ).',
            correctAnswer: 'Christi',
            explanation: 'The priest acts "in persona Christi" - in the person of Christ - especially during the consecration.'
          }
        ],
        completed: false
      },
      {
        id: 11,
        title: 'Liturgical Seasons and Their Impact on the Mass',
        content: `The Church year has different seasons, each with its own character:

• Advent: Preparation for Christmas (purple, except rose on Gaudete Sunday)
• Christmas: Celebration of Christ's birth (white/gold)
• Lent: Preparation for Easter through penance (purple, except rose on Laetare Sunday)
• Triduum: The three holiest days (Holy Thursday, Good Friday, Easter Vigil)
• Easter: Celebration of the Resurrection (white/gold, 50 days)
• Ordinary Time: The rest of the year (green)

Each season has different readings, prayers, and sometimes different parts of the Mass.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'How long is the Easter season?',
            options: ['One week', '40 days', '50 days', 'Three months'],
            correctAnswer: 2,
            explanation: 'The Easter season lasts 50 days, from Easter Sunday to Pentecost.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The _____ are the three holiest days: Holy Thursday, Good Friday, and Easter Vigil.',
            correctAnswer: 'Triduum',
            explanation: 'The Triduum (three days) are the holiest days of the Church year.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Ordinary Time uses green vestments.',
            correctAnswer: true,
            explanation: 'Yes! Ordinary Time uses green vestments, symbolizing growth and hope.'
          }
        ],
        completed: false
      },
      {
        id: 12,
        title: 'Music and the Mass',
        content: `Music is an integral part of the Mass:

• Parts that should be sung: Entrance, Gloria, Responsorial Psalm, Gospel Acclamation (Alleluia), Sanctus, Mystery of Faith, Great Amen, Lamb of God, and Communion

• Proper vs. Ordinary: Proper chants are specific to each day; Ordinary chants (like the Gloria) are the same throughout the year

• Role of Music: Sacred music helps us pray, unites the assembly, and elevates our hearts to God

Music in the Mass is not entertainment - it is prayer in another form.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is the role of music in the Mass?',
            options: ['Entertainment', 'Prayer in another form', 'Background noise', 'Optional decoration'],
            correctAnswer: 1,
            explanation: 'Music in the Mass is prayer in another form - it helps us pray, unites us, and elevates our hearts to God.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'The Gloria should be sung during Mass.',
            correctAnswer: true,
            explanation: 'Yes! The Gloria is one of the parts that should be sung (when it is used, not during Advent or Lent).'
          },
          {
            id: 3,
            type: 'fill-blank',
            question: 'The Gospel Acclamation is also called the _____.',
            correctAnswer: 'Alleluia',
            explanation: 'The Gospel Acclamation is the "Alleluia" (except during Lent when it is replaced with another acclamation).'
          }
        ],
        completed: false
      },
      {
        id: 13,
        title: 'Why Sunday Mass Obligation?',
        content: `Catholics are obligated to attend Mass on Sundays and holy days:

• Biblical Foundation: "Keep holy the Sabbath" (Exodus 20:8). For Christians, Sunday (the Lord's Day) replaces Saturday as the day of rest and worship.

• Church Teaching: The Church requires Sunday Mass attendance because it is essential for our spiritual life and our identity as Catholics.

• Communal Worship: We are not meant to be Christians alone - we need the community of believers. Sunday Mass strengthens us as a community and as individuals.

Missing Mass without a serious reason (like illness) is a grave sin because we are failing in our duty to worship God.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'Why is Sunday Mass attendance required?',
            options: ['It\'s a suggestion', 'It\'s essential for our spiritual life and identity as Catholics', 'It\'s optional', 'Only for priests'],
            correctAnswer: 1,
            explanation: 'Sunday Mass is required because it is essential for our spiritual life and our identity as Catholics.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'Missing Mass without a serious reason is a grave sin.',
            correctAnswer: true,
            explanation: 'Yes! Missing Mass without a serious reason (like illness) is a grave sin because we fail in our duty to worship God.'
          },
          {
            id: 3,
            type: 'fill-blank',
            question: 'Sunday is called the "_____ Day" for Christians.',
            correctAnswer: 'Lord\'s',
            explanation: 'Sunday is called the "Lord\'s Day" because it commemorates the day of Christ\'s resurrection.'
          }
        ],
        completed: false
      },
      {
        id: 14,
        title: 'How to Participate Fully in the Mass',
        content: `To get the most out of Mass, we should:

• Prepare Before Mass: Arrive early, review the readings, set aside distractions, and prepare our hearts

• During Mass: Respond and sing with the assembly, listen attentively to the Word, maintain reverence during Communion

• After Communion: Spend time in thanksgiving, reflecting on the gift we have received

• After Mass: Carry the grace of Mass into our daily lives

Active participation means engaging our minds, hearts, and bodies in the celebration.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What should we do after receiving Communion?',
            options: ['Leave immediately', 'Spend time in thanksgiving', 'Talk to friends', 'Check our phones'],
            correctAnswer: 1,
            explanation: 'After receiving Communion, we should spend time in thanksgiving, reflecting on the gift of Christ we have received.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'Active participation means engaging our minds, hearts, and bodies.',
            correctAnswer: true,
            explanation: 'Yes! Active participation means fully engaging - responding, singing, listening, and praying with our whole being.'
          },
          {
            id: 3,
            type: 'fill-blank',
            question: 'We should _____ before Mass by arriving early and preparing our hearts.',
            correctAnswer: 'prepare',
            explanation: 'Preparing before Mass helps us enter more fully into the celebration - arrive early, review readings, set aside distractions.'
          }
        ],
        completed: false
      },
      {
        id: 15,
        title: 'Common Questions About the Mass',
        content: `Common questions people have:

• Why can only priests consecrate? Only ordained priests (acting in persona Christi) have the power to consecrate, given by Christ to the apostles.

• Why can't non-Catholics receive Communion? Because Communion signifies full unity in faith, which non-Catholics don't share with us yet.

• Why do we kneel? Kneeling shows adoration and reverence, especially during the Consecration and after receiving Communion.

• What if I'm late? You can still attend, but try to arrive on time. If you miss the readings, you've missed an important part.

• Is online Mass valid? Online Mass is good for spiritual communion when you can't attend, but it doesn't fulfill the Sunday obligation.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'Why can\'t non-Catholics receive Communion?',
            options: ['They\'re not welcome', 'Communion signifies full unity in faith', 'It\'s a rule without reason', 'Only Catholics like it'],
            correctAnswer: 1,
            explanation: 'Non-Catholics can\'t receive Communion because it signifies full unity in faith, which we don\'t yet share.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'Online Mass fulfills the Sunday obligation.',
            correctAnswer: false,
            explanation: 'No! Online Mass is good for spiritual communion when you can\'t attend, but it doesn\'t fulfill the Sunday obligation to attend Mass in person.'
          },
          {
            id: 3,
            type: 'fill-blank',
            question: 'We kneel to show _____ and reverence, especially during the Consecration.',
            correctAnswer: 'adoration',
            explanation: 'Kneeling is a gesture of adoration and reverence, especially appropriate during the Consecration when Christ becomes present.'
          }
        ],
        completed: false
      },
      {
        id: 16,
        title: 'Summary and Call to a Deeper Eucharistic Life',
        content: `Key points about the Mass:

• The Mass is the source and summit of Christian life
• It re-presents Christ's sacrifice and nourishes us with his Body and Blood
• Active participation is essential
• Sunday Mass is a grave obligation

To grow in Eucharistic devotion:
• Attend Mass weekly (and daily if possible)
• Spend time in Eucharistic Adoration
• Visit the tabernacle for prayer
• Receive Communion worthily (in a state of grace)
• Live what we celebrate - be Christ's presence in the world

The Mass is not just a ritual - it is our encounter with the living God!`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is the Mass?',
            options: ['Just a ritual', 'Our encounter with the living God', 'A social event', 'Optional prayer'],
            correctAnswer: 1,
            explanation: 'The Mass is our encounter with the living God - it is not just a ritual, but a real meeting with Christ.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'We should receive Communion in a state of grace.',
            correctAnswer: true,
            explanation: 'Yes! We should receive Communion worthily, which means being in a state of grace (free from mortal sin).'
          },
          {
            id: 3,
            type: 'fill-blank',
            question: 'The Mass is the foundation of Catholic _____.',
            correctAnswer: 'identity',
            explanation: 'The Mass is the foundation of Catholic identity - it defines who we are and what we believe.'
          }
        ],
        completed: false
      }
    ];
  }

  private getCourse3Lessons(): Lesson[] {
    return [
      {
        id: 1,
        title: 'Introduction to the Sacraments',
        content: `What is a sacrament? A sacrament is a "visible sign of invisible grace" instituted by Christ. Sacraments are sacred rituals through which God's grace is given to us in a tangible way.

Why Jesus instituted the sacraments:
• Jesus knew we are both body and soul, so he gave us physical signs to receive spiritual grace
• Sacraments make God's love and presence concrete and accessible
• They help us grow spiritually and stay connected to Christ and the Church

Biblical foundations of sacramental life:
• Jesus' ministry included physical actions (healing, washing feet, breaking bread)
• He commanded his apostles to baptize (Matthew 28:19) and celebrate the Eucharist (Luke 22:19-20)
• The early Church practiced sacraments as seen in the Acts of the Apostles

How sacraments help us grow spiritually:
• They strengthen our relationship with God
• They mark important moments in our faith journey
• They provide grace to live as disciples of Christ`,
        questions: [
          {
            id: 1,
            type: 'fill-blank',
            question: 'A sacrament is a "visible sign of invisible _____" instituted by Christ.',
            correctAnswer: 'grace',
            explanation: 'Sacraments are visible signs that give us invisible grace - God\'s life and love.'
          },
          {
            id: 2,
            type: 'multiple-choice',
            question: 'Why did Jesus institute the sacraments?',
            options: ['To create rituals', 'Because we are both body and soul, so he gave us physical signs to receive spiritual grace', 'To follow tradition', 'To make religion complicated'],
            correctAnswer: 1,
            explanation: 'Jesus knew we are both body and soul, so he gave us physical signs (sacraments) to receive spiritual grace in a tangible way.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Sacraments help us grow spiritually and stay connected to Christ.',
            correctAnswer: true,
            explanation: 'Yes! Sacraments strengthen our relationship with God and provide grace to live as disciples of Christ.'
          }
        ],
        completed: false
      },
      {
        id: 2,
        title: 'Sacraments and the Life of Grace',
        content: `What is grace? Grace is God's free gift of his own life and love, which helps us to know, love, and serve him.

Types of grace:

Sanctifying grace:
• The grace that makes us holy and pleasing to God
• Received initially at Baptism
• Restored through Reconciliation if lost through mortal sin
• Makes us children of God and temples of the Holy Spirit

Actual grace:
• God's help for specific moments and actions
• Helps us to do good and avoid evil
• Available to everyone, even those not baptized
• Guides us in daily decisions

Sacramental grace:
• Special grace received through each sacrament
• Helps us fulfill the purpose of that particular sacrament
• For example: Matrimony gives grace to love and serve your spouse

Why grace is essential for salvation:
• We cannot save ourselves - we need God's help
• Grace transforms us from sinners into saints
• It enables us to live according to God's will
• Without grace, we cannot reach heaven`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is sanctifying grace?',
            options: ['Temporary help from God', 'The grace that makes us holy and pleasing to God', 'A type of prayer', 'A sacrament'],
            correctAnswer: 1,
            explanation: 'Sanctifying grace is the grace that makes us holy and pleasing to God, received initially at Baptism.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: '_____ grace is God\'s help for specific moments and actions.',
            correctAnswer: 'Actual',
            explanation: 'Actual grace is God\'s help for specific moments - it helps us do good and avoid evil in daily life.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Grace is essential for salvation because we cannot save ourselves.',
            correctAnswer: true,
            explanation: 'Yes! We need God\'s grace to be saved - we cannot save ourselves through our own efforts alone.'
          }
        ],
        completed: false
      },
      {
        id: 3,
        title: 'Overview of the Seven Sacraments',
        content: `The Catholic Church has seven sacraments, grouped by their purpose:

Sacraments of Initiation (bring us into the Church and strengthen us):
1. Baptism - Entry into the Church, removes original sin
2. Confirmation - Strengthens us with the Holy Spirit
3. Holy Eucharist - The Body and Blood of Christ, our spiritual nourishment

Sacraments of Healing (restore and strengthen us):
4. Reconciliation (Confession) - Forgiveness of sins
5. Anointing of the Sick - Healing and comfort for the ill

Sacraments of Service (help us serve others):
6. Matrimony - Holy marriage between a man and woman
7. Holy Orders - Ordination to priesthood (bishop, priest, or deacon)

Each sacrament gives us specific graces to live our Christian vocation. Together, they mark the important moments of our life journey and help us grow in holiness.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'How many sacraments are there in the Catholic Church?',
            options: ['Five', 'Six', 'Seven', 'Ten'],
            correctAnswer: 2,
            explanation: 'The Catholic Church has seven sacraments instituted by Christ.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The Sacraments of _____ bring us into the Church and strengthen us.',
            correctAnswer: 'Initiation',
            explanation: 'The Sacraments of Initiation (Baptism, Confirmation, Eucharist) bring us into the Church and strengthen us.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Reconciliation and Anointing of the Sick are Sacraments of Healing.',
            correctAnswer: true,
            explanation: 'Yes! Reconciliation and Anointing of the Sick are the two Sacraments of Healing.'
          }
        ],
        completed: false
      },
      {
        id: 4,
        title: 'Baptism: The First Sacrament',
        content: `Baptism is the first sacrament and the gateway to all other sacraments.

Biblical roots:
• Jesus commanded: "Go, therefore, and make disciples of all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Spirit" (Matthew 28:19)
• Jesus said: "Unless one is born of water and the Spirit, he cannot enter the kingdom of God" (John 3:5)

Effects of baptism:
• Forgiveness of original sin and all personal sins
• New life as a child of God
• Becoming a member of the Church
• Receiving sanctifying grace
• Becoming a temple of the Holy Spirit
• An indelible spiritual mark (character) that can never be erased

Role of godparents:
• Help the parents raise the child in the faith
• Must be practicing Catholics, at least 16 years old, and confirmed
• Represent the Church community

Baptismal promises:
• We renounce Satan and all his works
• We profess faith in God the Father, Son, and Holy Spirit
• We commit to living as disciples of Christ`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What does Baptism do?',
            options: ['Only removes original sin', 'Forgives original sin, gives new life, makes us children of God', 'Is just a ceremony', 'Only for babies'],
            correctAnswer: 1,
            explanation: 'Baptism forgives original sin, gives us new life as children of God, makes us members of the Church, and gives us sanctifying grace.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'Jesus said: "Unless one is born of water and the _____, he cannot enter the kingdom of God."',
            correctAnswer: 'Spirit',
            explanation: 'In John 3:5, Jesus emphasizes that Baptism (water and the Spirit) is necessary for entering the kingdom of God.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Baptism leaves an indelible spiritual mark that can never be erased.',
            correctAnswer: true,
            explanation: 'Yes! Baptism leaves a permanent spiritual mark (character) that makes us forever a child of God, even if we sin later.'
          }
        ],
        completed: false
      },
      {
        id: 5,
        title: 'Confirmation: The Gift of the Holy Spirit',
        content: `Confirmation completes the grace of Baptism and strengthens us with the Holy Spirit.

The Holy Spirit in Scripture:
• At Pentecost (Acts 2), the Holy Spirit descended upon the apostles
• They were filled with courage and began to preach the Gospel
• This same Spirit is given to us in Confirmation

Seven gifts of the Holy Spirit:
1. Wisdom - to see things from God's perspective
2. Understanding - to grasp the truths of faith
3. Counsel (Right Judgment) - to make good decisions
4. Fortitude (Courage) - to stand up for our faith
5. Knowledge - to know God and his will
6. Piety (Reverence) - to love and worship God
7. Fear of the Lord (Wonder and Awe) - to be in awe of God's greatness

Role of the bishop:
• The bishop is the ordinary minister of Confirmation
• This shows the connection to the apostles
• In special circumstances, a priest can confirm with permission

Why Confirmation strengthens our mission:
• It gives us courage to witness to Christ
• It helps us live as adult members of the Church
• It empowers us to share our faith with others
• It strengthens us to resist temptation`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'How many gifts of the Holy Spirit are there?',
            options: ['Five', 'Six', 'Seven', 'Twelve'],
            correctAnswer: 2,
            explanation: 'There are seven gifts of the Holy Spirit: wisdom, understanding, counsel, fortitude, knowledge, piety, and fear of the Lord.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The _____ is the ordinary minister of Confirmation.',
            correctAnswer: 'bishop',
            explanation: 'The bishop is the ordinary minister of Confirmation, showing the connection to the apostles who received the Holy Spirit at Pentecost.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Confirmation gives us courage to witness to Christ and share our faith.',
            correctAnswer: true,
            explanation: 'Yes! Confirmation strengthens us with the Holy Spirit to be bold witnesses of Christ in the world.'
          }
        ],
        completed: false
      },
      {
        id: 6,
        title: 'Holy Eucharist: The Source and Summit',
        content: `The Eucharist is the greatest of all sacraments - the source and summit of Christian life.

The Last Supper:
• Jesus took bread, blessed it, and said: "This is my Body" (Matthew 26:26)
• He took the cup and said: "This is my Blood of the covenant" (Matthew 26:28)
• He commanded: "Do this in memory of me" (Luke 22:19)

Real Presence:
• Catholics believe in the Real Presence: the bread and wine truly become the Body, Blood, Soul, and Divinity of Jesus Christ
• This is not a symbol - it is truly Christ himself
• The appearance (accidents) remains as bread and wine, but the substance becomes Christ
• This is called "transubstantiation"

Communion as spiritual nourishment:
• Just as our bodies need food, our souls need the Eucharist
• It strengthens us to live as Christians
• It unites us with Christ and with all the faithful
• It forgives venial sins and preserves us from mortal sin

Eucharist as sacrifice, meal, and memorial:
• Sacrifice: The Mass re-presents Christ's sacrifice on the cross
• Meal: We receive Christ as spiritual food
• Memorial: Not just remembering, but making present the saving events`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is the Real Presence?',
            options: ['A symbol', 'The bread and wine truly become the Body, Blood, Soul, and Divinity of Christ', 'Just a memory', 'A blessing'],
            correctAnswer: 1,
            explanation: 'The Real Presence means the bread and wine truly become the Body, Blood, Soul, and Divinity of Jesus Christ - not a symbol, but truly Christ himself.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The Eucharist is the source and _____ of Christian life.',
            correctAnswer: 'summit',
            explanation: 'The Eucharist is called the "source and summit" because it is both where we draw strength from and the goal toward which all Christian life points.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Eucharist is sacrifice, meal, and memorial.',
            correctAnswer: true,
            explanation: 'Yes! The Eucharist has three dimensions: it is a sacrifice (re-presents Christ\'s death), a meal (we receive Christ), and a memorial (makes present the saving events).'
          }
        ],
        completed: false
      },
      {
        id: 7,
        title: 'Reconciliation: The Sacrament of Mercy',
        content: `Reconciliation (also called Confession or Penance) is the sacrament of God's mercy and forgiveness.

Why we confess sins:
• Jesus gave the apostles the power to forgive sins (John 20:22-23)
• Confession helps us acknowledge our sins and receive God's mercy
• It restores our relationship with God if broken by mortal sin
• It gives us grace to avoid sin in the future

Sin: mortal vs. venial:
• Mortal sin: Serious sin that breaks our relationship with God
  - Must be grave matter (serious)
  - Must be done with full knowledge
  - Must be done with deliberate consent
  - Requires Confession before receiving Communion
• Venial sin: Less serious sin that weakens but doesn't break our relationship with God
  - Can be forgiven through prayer, good works, and the Eucharist
  - Still should be confessed regularly

Role of the priest in absolution:
• The priest acts "in persona Christi" (in the person of Christ)
• Only a priest can give absolution (forgiveness)
• The priest is bound by the seal of confession - he can never reveal what is confessed

Steps to a good confession:
1. Examine your conscience
2. Be truly sorry (contrition)
3. Confess all mortal sins
4. Make a firm purpose of amendment (resolve not to sin again)
5. Do the penance the priest gives you`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What are the two types of sin?',
            options: ['Big and small', 'Mortal and venial', 'Serious and minor', 'Major and petty'],
            correctAnswer: 1,
            explanation: 'The two types of sin are mortal (serious, breaks relationship with God) and venial (less serious, weakens but doesn\'t break the relationship).'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The priest is bound by the _____ of confession - he can never reveal what is confessed.',
            correctAnswer: 'seal',
            explanation: 'The seal of confession is absolute - a priest can never reveal what is said in confession, even under threat of death.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Mortal sin requires Confession before receiving Communion.',
            correctAnswer: true,
            explanation: 'Yes! If we have committed mortal sin, we must go to Confession before receiving Communion.'
          }
        ],
        completed: false
      },
      {
        id: 8,
        title: 'Anointing of the Sick: Strength in Illness',
        content: `Anointing of the Sick is a sacrament of healing and strength for those who are seriously ill.

Scriptural basis:
• "Is anyone among you sick? He should summon the presbyters of the church, and they should pray over him and anoint him with oil in the name of the Lord" (James 5:14-15)
• Jesus healed the sick during his ministry
• The apostles also healed in Jesus' name

Purpose: spiritual and sometimes physical healing
• Primarily for spiritual healing: peace, strength, forgiveness of sins
• Sometimes God grants physical healing as well
• Helps the person unite their suffering with Christ's suffering
• Gives courage to face illness or death

When someone should receive it:
• Anyone seriously ill (not just dying)
• Before major surgery
• Elderly people whose health is declining
• Those with chronic or serious illness
• Can be received multiple times if illness continues or worsens

Not only for the dying - sacrament of strength:
• This sacrament is NOT just for those at the point of death
• It is for anyone seriously ill who needs God's strength
• It helps people face illness with faith and courage
• It can be received whenever there is a serious health concern`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'When should someone receive Anointing of the Sick?',
            options: ['Only when dying', 'When seriously ill, before surgery, or when health is declining', 'Only once in a lifetime', 'Never'],
            correctAnswer: 1,
            explanation: 'Anointing of the Sick should be received by anyone seriously ill, before major surgery, or when health is declining - not just when dying.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The Anointing of the Sick is primarily for _____ healing, though sometimes physical healing occurs.',
            correctAnswer: 'spiritual',
            explanation: 'The primary purpose is spiritual healing (peace, strength, forgiveness), though God sometimes grants physical healing as well.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Anointing of the Sick can be received multiple times if illness continues.',
            correctAnswer: true,
            explanation: 'Yes! If someone\'s illness continues or worsens, they can receive Anointing of the Sick again.'
          }
        ],
        completed: false
      },
      {
        id: 9,
        title: 'Matrimony: A Lifelong Covenant',
        content: `Matrimony is the sacrament of marriage between a baptized man and woman.

Marriage in God's plan:
• From the beginning, God created man and woman for each other (Genesis 2:24)
• Jesus elevated marriage to a sacrament
• Marriage reflects the love between Christ and the Church (Ephesians 5:25-32)

Lifelong covenant between husband and wife:
• Marriage is a permanent bond - "until death do us part"
• It cannot be dissolved by human authority
• The couple gives themselves completely to each other
• They promise to love, honor, and cherish each other

Openness to life:
• Marriage is naturally ordered toward the procreation and education of children
• Couples should be open to having children
• Natural Family Planning is acceptable for serious reasons
• Artificial contraception is contrary to God's plan

The grace to love and serve each other:
• Matrimony gives special grace to love and serve your spouse
• It helps couples grow in holiness together
• It strengthens them to face life's challenges
• It helps them raise children in the faith`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is marriage in the Catholic Church?',
            options: ['A contract', 'A lifelong covenant between a baptized man and woman', 'A temporary arrangement', 'Just a ceremony'],
            correctAnswer: 1,
            explanation: 'Marriage is a lifelong covenant (sacred bond) between a baptized man and woman, elevated by Christ to a sacrament.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'Marriage is naturally ordered toward the procreation and _____ of children.',
            correctAnswer: 'education',
            explanation: 'Marriage is ordered toward both having children (procreation) and raising them in the faith (education).'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Marriage gives special grace to love and serve your spouse.',
            correctAnswer: true,
            explanation: 'Yes! The sacrament of Matrimony gives couples special grace to love, honor, and serve each other throughout their lives.'
          }
        ],
        completed: false
      },
      {
        id: 10,
        title: 'Holy Orders: Service to the Church',
        content: `Holy Orders is the sacrament through which men are ordained to serve the Church as bishops, priests, or deacons.

Three degrees:
• Bishop: Successor of the apostles, has the fullness of Holy Orders
  - Can ordain priests and deacons
  - Leads a diocese
  - Teaches, sanctifies, and governs
• Priest: Acts in persona Christi (in the person of Christ)
  - Can celebrate Mass and hear confessions
  - Serves a parish or other ministry
  - Preaches, administers sacraments, serves the people
• Deacon: Serves in a ministry of service
  - Can baptize, witness marriages, preach, assist at Mass
  - Cannot celebrate Mass or hear confessions
  - Often serves in parishes, hospitals, or other ministries

Why only men are ordained:
• Jesus chose only men as his apostles
• The priest acts "in persona Christi" - representing Christ the bridegroom
• This is a matter of faith, not discrimination
• Women have many other important roles in the Church

Role of priests as shepherds and servants:
• Priests are shepherds who guide and care for God's people
• They serve by celebrating Mass, hearing confessions, anointing the sick
• They teach the faith and help people grow spiritually
• They lead the community in worship and service

The call to ministry in the Church:
• Holy Orders is a vocation (calling from God)
• Not everyone is called to priesthood
• Those who are called must discern carefully
• It requires a life of prayer, service, and celibacy (for priests and bishops)`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What are the three degrees of Holy Orders?',
            options: ['Pope, Cardinal, Bishop', 'Bishop, Priest, Deacon', 'Priest, Deacon, Layperson', 'Pope, Bishop, Priest'],
            correctAnswer: 1,
            explanation: 'The three degrees of Holy Orders are: Bishop (fullness of orders), Priest (can celebrate Mass), and Deacon (ministry of service).'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The priest acts "in persona _____" (in the person of Christ).',
            correctAnswer: 'Christi',
            explanation: 'The priest acts "in persona Christi" - in the person of Christ - especially when celebrating Mass and hearing confessions.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Holy Orders is a vocation - a calling from God.',
            correctAnswer: true,
            explanation: 'Yes! Holy Orders is a vocation that requires careful discernment. Not everyone is called to priesthood.'
          }
        ],
        completed: false
      },
      {
        id: 11,
        title: 'How the Sacraments Work',
        content: `Sacraments work through specific elements that make them valid and effective.

Matter and form:
• Matter: The physical element (water for Baptism, bread and wine for Eucharist, oil for Anointing)
• Form: The words spoken (the formula that makes the sacrament)
• Both matter and form must be correct for the sacrament to be valid
• Example: Baptism requires water (matter) and the words "I baptize you in the name of the Father, and of the Son, and of the Holy Spirit" (form)

The role of intention:
• The minister must intend to do what the Church does
• The recipient must have the right intention (for example, wanting to be baptized)
• Without proper intention, the sacrament may be invalid

"Ex opere operato" (Christ works through the sacrament):
• This Latin phrase means "by the work worked"
• It means the sacrament works because of Christ's power, not because of the holiness of the minister
• Even if the priest is a sinner, the sacrament is still valid
• Christ is the one who acts through the sacrament

The faith of the recipient:
• While sacraments work "ex opere operato," the recipient's faith and disposition matter
• We should receive sacraments with faith, reverence, and proper preparation
• The more we believe and are open to grace, the more we benefit
• However, sacraments still give grace even if our faith is weak`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What does "ex opere operato" mean?',
            options: ['By human effort', 'By the work worked - Christ works through the sacrament', 'By faith alone', 'By the priest\'s holiness'],
            correctAnswer: 1,
            explanation: '"Ex opere operato" means the sacrament works because of Christ\'s power, not because of the holiness of the minister or recipient.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The _____ is the physical element, and the _____ is the words spoken in a sacrament.',
            correctAnswer: 'matter, form',
            explanation: 'Matter is the physical element (water, bread, oil), and form is the words spoken (the formula). Both are needed for a valid sacrament.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The recipient\'s faith and disposition affect how much we benefit from the sacrament.',
            correctAnswer: true,
            explanation: 'Yes! While sacraments work "ex opere operato," our faith, reverence, and proper preparation help us receive more grace.'
          }
        ],
        completed: false
      },
      {
        id: 12,
        title: 'Sacramentals vs. Sacraments',
        content: `Sacramentals are sacred signs that help us grow in devotion, but they are different from sacraments.

Examples of sacramentals:
• Holy water: Reminds us of Baptism, used for blessing
• Rosaries: Help us meditate on the mysteries of Christ's life
• Medals: Remind us of saints and their intercession
• Scapulars: Signs of devotion to Mary
• Blessings: Prayers that invoke God's protection
• Crucifixes, statues, icons: Help us focus on God and the saints

Difference between blessings and sacraments:
• Sacraments: Instituted by Christ, give grace directly, necessary for salvation (some of them)
• Sacramentals: Instituted by the Church, prepare us to receive grace, helpful but not necessary
• Sacraments work "ex opere operato" (by Christ's power)
• Sacramentals work through the Church's prayer and our faith

How sacramentals help us grow in devotion:
• They remind us of God's presence
• They help us focus our minds and hearts on prayer
• They connect us to the communion of saints
• They prepare us to receive sacramental grace
• They help us live our faith in daily life`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is the main difference between sacraments and sacramentals?',
            options: ['No difference', 'Sacraments were instituted by Christ and give grace directly; sacramentals were instituted by the Church and prepare us for grace', 'Sacramentals are more important', 'Only sacraments exist'],
            correctAnswer: 1,
            explanation: 'Sacraments were instituted by Christ and give grace directly. Sacramentals were instituted by the Church and help prepare us to receive grace.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: '_____ water reminds us of Baptism and is used for blessing.',
            correctAnswer: 'Holy',
            explanation: 'Holy water is a sacramental that reminds us of Baptism and is used for blessings and protection.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Sacramentals help us grow in devotion and prepare us to receive sacramental grace.',
            correctAnswer: true,
            explanation: 'Yes! Sacramentals like rosaries, medals, and holy water help us focus on prayer and prepare our hearts to receive God\'s grace.'
          }
        ],
        completed: false
      },
      {
        id: 13,
        title: 'Living a Sacramental Life',
        content: `Living a sacramental life means making the sacraments a regular part of our spiritual journey.

Frequent confession:
• Go to Confession regularly (at least monthly, or more often if needed)
• Don't wait until you have mortal sin
• Regular confession helps us grow in self-awareness and holiness
• It strengthens us to resist temptation

Regular reception of the Eucharist:
• Receive Communion at least weekly (Sunday Mass obligation)
• Daily Mass and Communion is even better if possible
• Always receive in a state of grace (no mortal sin)
• Prepare your heart before receiving

Participating in parish community:
• The sacraments are meant to be celebrated in community
• Join parish activities and ministries
• Support your parish financially and through service
• Build relationships with other Catholics

Bringing grace into daily life:
• Family: Pray together, celebrate feast days, live the faith at home
• Work: See your work as a way to serve God and others
• Relationships: Treat others with love and respect, as Christ would
• Challenges: Turn to the sacraments when facing difficulties
• Joy: Celebrate God's blessings and give thanks

The sacraments are not just rituals - they are encounters with Christ that should transform our entire lives.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'How often should Catholics go to Confession?',
            options: ['Never', 'Only when they have mortal sin', 'Regularly, at least monthly', 'Once a year'],
            correctAnswer: 2,
            explanation: 'Catholics should go to Confession regularly (at least monthly), not just when they have mortal sin. Regular confession helps us grow in holiness.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'We should always receive the Eucharist in a state of _____ (no mortal sin).',
            correctAnswer: 'grace',
            explanation: 'We must be in a state of grace (free from mortal sin) to receive the Eucharist worthily. If we have mortal sin, we must go to Confession first.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The sacraments should transform our entire lives, not just be rituals we perform.',
            correctAnswer: true,
            explanation: 'Yes! The sacraments are encounters with Christ that should transform how we live - in our families, work, relationships, and daily challenges.'
          }
        ],
        completed: false
      },
      {
        id: 14,
        title: 'Summary and Closing',
        content: `The sacraments are gifts from Christ that help us grow in holiness and stay connected to God.

Key points to remember:
• Sacraments are "visible signs of invisible grace" instituted by Christ
• There are seven sacraments: Baptism, Confirmation, Eucharist, Reconciliation, Anointing of the Sick, Matrimony, and Holy Orders
• Sacraments give us grace - God's life and love
• Each sacrament has a specific purpose and gives specific graces
• Sacraments work through matter, form, and intention
• Sacramentals (like rosaries and holy water) help us grow in devotion

The sacraments as gifts from Christ:
• Jesus gave us the sacraments because he loves us
• They are his way of staying with us and giving us his grace
• They mark the important moments of our life journey
• They help us become saints

Invitation to deepen your sacramental life:
• Make the sacraments a regular part of your life
• Go to Confession regularly
• Receive the Eucharist frequently
• Participate actively in your parish
• Learn more about each sacrament
• Share your faith with others

Encouragement to continue learning and receiving God's grace:
• Faith is a journey, not a destination
• Keep learning about your faith
• Receive the sacraments with faith and reverence
• Let the sacraments transform your life
• Trust in God's grace to help you grow in holiness

The sacraments are channels of God's grace - use them regularly to stay close to Christ!`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What are the sacraments?',
            options: ['Just rituals', 'Gifts from Christ that are channels of God\'s grace', 'Optional practices', 'Only for priests'],
            correctAnswer: 1,
            explanation: 'The sacraments are gifts from Christ - visible signs that give us invisible grace. They are channels through which God\'s grace flows to us.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'Faith is a _____, not a destination.',
            correctAnswer: 'journey',
            explanation: 'Faith is a lifelong journey of growing closer to God. The sacraments help us on this journey.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'We should make the sacraments a regular part of our lives to stay close to Christ.',
            correctAnswer: true,
            explanation: 'Yes! The sacraments are channels of God\'s grace - we should use them regularly to grow in holiness and stay close to Christ.'
          }
        ],
        completed: false
      }
    ];
  }

  courseTitle: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private certificateService: CertificateService,
    private scoreboardService: ScoreboardService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = +params['id'] || 1;
      this.loadLessons();
      this.loadProgress();
      this.initializeLesson();
    });
  }

  loadLessons() {
    if (this.courseId === 1) {
      this.lessons = this.getCourse1Lessons();
      this.courseTitle = 'Introduction to the Catholic Faith';
    } else if (this.courseId === 2) {
      this.lessons = this.getCourse2Lessons();
      this.courseTitle = 'Understanding the Holy Mass';
    } else if (this.courseId === 3) {
      this.lessons = this.getCourse3Lessons();
      this.courseTitle = 'The Sacraments: Channels of God\'s Grace';
    } else {
      // Default to course 1 if course not found
      this.lessons = this.getCourse1Lessons();
      this.courseTitle = 'Introduction to the Catholic Faith';
    }
  }

  loadProgress() {
    const saved = localStorage.getItem(`course_progress_${this.courseId}`);
    if (saved) {
      this.progress = JSON.parse(saved);
      this.currentLessonIndex = this.progress!.currentLesson;
      
      // Restore question completion status from saved progress
      this.restoreQuestionProgress();
    } else {
      this.progress = {
        courseId: this.courseId,
        currentLesson: 0,
        lessonsCompleted: [],
        totalXP: 0,
        streak: 0,
        lastStudyDate: ''
      };
    }
  }

  restoreQuestionProgress() {
    // Load saved question completions
    const savedQuestions = localStorage.getItem(`course_questions_${this.courseId}`);
    if (savedQuestions) {
      const completedQuestions = JSON.parse(savedQuestions);
      
      // Mark questions as completed based on saved data
      this.lessons.forEach(lesson => {
        lesson.questions.forEach(question => {
          const questionKey = `${lesson.id}_${question.id}`;
          if (completedQuestions[questionKey]) {
            question.isCompleted = true;
            question.isCorrect = true;
            question.userAnswer = completedQuestions[questionKey].userAnswer;
          }
        });
      });
    }
  }

  saveQuestionProgress() {
    // Save which questions have been completed
    const completedQuestions: any = {};
    
    this.lessons.forEach(lesson => {
      lesson.questions.forEach(question => {
        if (question.isCompleted) {
          const questionKey = `${lesson.id}_${question.id}`;
          completedQuestions[questionKey] = {
            userAnswer: question.userAnswer,
            isCorrect: question.isCorrect
          };
        }
      });
    });
    
    localStorage.setItem(`course_questions_${this.courseId}`, JSON.stringify(completedQuestions));
  }

  saveProgress() {
    if (this.progress) {
      this.progress.currentLesson = this.currentLessonIndex;
      localStorage.setItem(`course_progress_${this.courseId}`, JSON.stringify(this.progress));
      this.saveQuestionProgress(); // Also save question completion status
    }
  }

  initializeLesson() {
    if (!this.lessons || this.lessons.length === 0) {
      return; // Wait for lessons to load
    }
    if (this.progress && this.progress.lessonsCompleted.length > 0) {
      // Find first incomplete lesson
      const incompleteIndex = this.lessons.findIndex((lesson, index) => 
        !this.progress!.lessonsCompleted.includes(lesson.id)
      );
      if (incompleteIndex !== -1) {
        this.currentLessonIndex = incompleteIndex;
      }
    }
    this.currentQuestionIndex = 0;
    this.showResult = false;
    this.hasStartedLesson = false;
  }

  startLesson() {
    this.hasStartedLesson = true;
    this.currentQuestionIndex = 0;
    this.showResult = false;
  }

  get currentLesson(): Lesson {
    return this.lessons[this.currentLessonIndex];
  }

  get currentQuestion(): Question {
    return this.currentLesson.questions[this.currentQuestionIndex];
  }

  get progressPercentage(): number {
    if (!this.lessons || this.lessons.length === 0) {
      return 0;
    }
    const completed = this.progress?.lessonsCompleted.length || 0;
    return Math.round((completed / this.lessons.length) * 100);
  }

  get totalXP(): number {
    return this.progress?.totalXP || 0;
  }

  get streak(): number {
    return this.progress?.streak || 0;
  }

  submitAnswer(answer: any) {
    const question = this.currentQuestion;
    question.userAnswer = answer;
    
    if (question.type === 'multiple-choice') {
      question.isCorrect = question.userAnswer === question.correctAnswer;
    } else if (question.type === 'true-false') {
      question.isCorrect = question.userAnswer === question.correctAnswer;
    } else if (question.type === 'fill-blank') {
      question.isCorrect = (question.userAnswer as string).toLowerCase().trim() === 
                          (question.correctAnswer as string).toLowerCase().trim();
    }

    this.showResult = true;
    
    if (question.isCorrect) {
      question.isCompleted = true; // Mark question as completed
      this.xpGained = 10;
      this.updateStreak();
      if (this.progress) {
        this.progress.totalXP += this.xpGained + this.streakBonus;
      }
      
      // Check if lesson is completed (all questions answered correctly)
      this.checkAndCompleteLesson();
    }
  }

  checkAndCompleteLesson() {
    if (!this.progress) return;
    
    // Check if all questions in current lesson are completed
    const allQuestionsCompleted = this.currentLesson.questions.every(q => q.isCompleted === true);
    
    if (allQuestionsCompleted && !this.progress.lessonsCompleted.includes(this.currentLesson.id)) {
      // Mark lesson as completed
      this.progress.lessonsCompleted.push(this.currentLesson.id);
      this.currentLesson.completed = true;
      
      // Award bonus XP for completing lesson
      const lessonBonus = 50;
      this.xpGained += lessonBonus;
      if (this.progress) {
        this.progress.totalXP += lessonBonus;
      }
      
      // Save progress
      this.saveProgress();
      
      // Update scoreboard
      this.updateScoreboard();
      
      // Check if entire course is completed
      if (this.isCourseCompleted()) {
        this.awardCertificate();
      }
    }
  }

  handleEnterKey() {
    if (!this.showResult && this.currentQuestion.userAnswer) {
      this.submitAnswer(this.currentQuestion.userAnswer);
    }
  }

  updateStreak() {
    if (!this.progress) return;
    
    const today = new Date().toDateString();
    const lastDate = this.progress.lastStudyDate;
    
    if (lastDate === today) {
      // Already studied today, no streak change
    } else if (lastDate && this.isConsecutiveDay(lastDate, today)) {
      // Consecutive day
      this.progress.streak += 1;
    } else {
      // New or broken streak
      this.progress.streak = 1;
    }
    
    this.progress.lastStudyDate = today;
    this.streakBonus = Math.min(this.progress.streak * 2, 20); // Max 20 bonus XP
  }

  isConsecutiveDay(lastDate: string, today: string): boolean {
    const last = new Date(lastDate);
    const current = new Date(today);
    const diffTime = current.getTime() - last.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays === 1;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.currentLesson.questions.length - 1) {
      this.currentQuestionIndex++;
      this.showResult = false;
    } else {
      // Lesson completed
      this.completeLesson();
    }
  }

  completeLesson() {
    // This method is called when user clicks "Complete Lesson" button
    // But lesson completion is now handled automatically when all questions are correct
    // Just move to next lesson if available
    if (this.currentLessonIndex < this.lessons.length - 1) {
      this.currentLessonIndex++;
      this.currentQuestionIndex = 0;
      this.showResult = false;
      this.hasStartedLesson = false;
      this.saveProgress();
    }
  }

  isCourseCompleted(): boolean {
    if (!this.progress || !this.lessons || this.lessons.length === 0) {
      return false;
    }
    return this.progress.lessonsCompleted.length === this.lessons.length;
  }

  async awardCertificate() {
    // Check if certificate already exists
    if (this.certificateService.hasCertificate(this.courseId)) {
      return;
    }

    const userName = this.scoreboardService.getCurrentUserName();
    const certificate = this.certificateService.generateCertificate(
      this.courseId,
      this.courseTitle,
      userName
    );

    // Show alert
    const alert = await this.alertController.create({
      header: '🎉 Course Completed!',
      message: `Congratulations! You've completed "${this.courseTitle}". Your certificate is ready to download!`,
      buttons: [
        {
          text: 'Download Certificate',
          handler: () => {
            this.certificateService.downloadCertificateAsImage(certificate);
          }
        },
        {
          text: 'Later',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  updateScoreboard() {
    if (!this.progress) return;
    
    const userId = this.scoreboardService.getCurrentUserId();
    const userName = this.scoreboardService.getCurrentUserName();
    const coursesCompleted = this.isCourseCompleted() ? 1 : 0;
    
    this.scoreboardService.updateUserScore(
      userId,
      userName,
      this.progress.totalXP,
      coursesCompleted,
      this.progress.streak
    );
  }

  retryQuestion() {
    this.currentQuestion.userAnswer = undefined;
    this.currentQuestion.isCorrect = undefined;
    this.showResult = false;
    this.xpGained = 0;
  }

  goToNextLesson() {
    if (this.currentLessonIndex < this.lessons.length - 1) {
      this.currentLessonIndex++;
      this.currentQuestionIndex = 0;
      this.showResult = false;
      this.hasStartedLesson = false;
      this.saveProgress();
    }
  }

  goToPreviousLesson() {
    if (this.currentLessonIndex > 0) {
      this.currentLessonIndex--;
      this.currentQuestionIndex = 0;
      this.showResult = false;
      this.hasStartedLesson = false;
    }
  }

  selectLesson(index: number) {
    this.currentLessonIndex = index;
    this.currentQuestionIndex = 0;
    this.showResult = false;
    this.hasStartedLesson = false;
    this.saveProgress();
  }

  isLessonCompleted(lessonId: number): boolean {
    return this.progress?.lessonsCompleted.includes(lessonId) || false;
  }

  formatContent(content: string): string {
    return content.replace(/\n/g, '<br>');
  }
}

