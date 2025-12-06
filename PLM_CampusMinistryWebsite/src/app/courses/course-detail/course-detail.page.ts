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
  hasContent: boolean = false;
  courseTitle: string = '';

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

  private getCourse4Lessons(): Lesson[] {
    return [
      {
        id: 1,
        title: 'Introduction to the Bible',
        content: `What is the Bible? The Bible is the collection of sacred books that contain God's revelation to humanity. It is the Word of God written by human authors under the inspiration of the Holy Spirit.

The Bible as God's Word (Divine Inspiration):
• The Bible is not just a human book - it is God's Word
• God inspired human authors to write what he wanted
• The Holy Spirit guided the writers while preserving their unique styles
• Every word is important because God is the primary author

The Bible as a library of books:
• The Bible is not one book, but a library of 73 books (Catholic Bible)
• Written over 1,500 years by many different authors
• Contains different literary forms: history, poetry, prophecy, letters, etc.
• All books work together to tell one story: God's plan of salvation

Why the Bible is central to Catholic faith:
• It reveals who God is and who we are
• It tells the story of salvation from creation to the end of time
• It guides our faith, morals, and worship
• It is read at every Mass in the Liturgy of the Word
• It is the foundation of Catholic teaching

How the Bible reveals God's plan of salvation:
• Old Testament: God's preparation and promise of a Savior
• New Testament: The fulfillment in Jesus Christ
• From Genesis to Revelation, one continuous story of God's love
• Every book points to Christ and our salvation`,
        questions: [
          {
            id: 1,
            type: 'fill-blank',
            question: 'The Bible is the Word of God written by human authors under the inspiration of the _____ Spirit.',
            correctAnswer: 'Holy',
            explanation: 'The Holy Spirit inspired the human authors to write what God wanted, making the Bible truly God\'s Word.'
          },
          {
            id: 2,
            type: 'multiple-choice',
            question: 'How many books are in the Catholic Bible?',
            options: ['66', '70', '73', '80'],
            correctAnswer: 2,
            explanation: 'The Catholic Bible contains 73 books - 46 in the Old Testament and 27 in the New Testament.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Bible is central to Catholic faith and is read at every Mass.',
            correctAnswer: true,
            explanation: 'Yes! The Bible is essential to Catholicism and is proclaimed at every Mass in the Liturgy of the Word.'
          }
        ],
        completed: false
      },
      {
        id: 2,
        title: 'Structure of the Catholic Bible: Old Testament',
        content: `The Old Testament contains 46 books, divided into four main sections:

Pentateuch (Torah/Law) – 5 books:
• Genesis: Creation, the Fall, the patriarchs
• Exodus: The escape from Egypt, the Ten Commandments
• Leviticus: Laws for worship and holiness
• Numbers: The journey through the wilderness
• Deuteronomy: Moses' final words and the law

Historical Books – 16 books:
• Joshua, Judges, Ruth, 1-2 Samuel, 1-2 Kings, 1-2 Chronicles, Ezra, Nehemiah, Tobit, Judith, Esther, 1-2 Maccabees
• Tell the history of Israel from the conquest of Canaan to the Maccabean revolt
• Show God's faithfulness despite human sinfulness

Wisdom Books (Writings) – 7 books:
• Job: Suffering and God's justice
• Psalms: Prayers and hymns (150 psalms)
• Proverbs: Practical wisdom for daily life
• Ecclesiastes: The meaning of life
• Song of Songs: Love poetry (also seen as God's love for his people)
• Wisdom: God's wisdom personified
• Sirach (Ecclesiasticus): Wisdom teachings

Prophetic Books – 18 books:
• Major Prophets: Isaiah, Jeremiah, Lamentations, Baruch, Ezekiel, Daniel
• Minor Prophets: Hosea, Joel, Amos, Obadiah, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Haggai, Zechariah, Malachi
• Prophets called Israel back to faithfulness and foretold the coming of the Messiah`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'How many books are in the Old Testament?',
            options: ['39', '46', '27', '66'],
            correctAnswer: 1,
            explanation: 'The Catholic Old Testament contains 46 books, including the deuterocanonical books.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The first five books of the Bible are called the _____ or Torah.',
            correctAnswer: 'Pentateuch',
            explanation: 'The Pentateuch (also called Torah or Law) consists of Genesis, Exodus, Leviticus, Numbers, and Deuteronomy.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Psalms are prayers and hymns found in the Wisdom Books.',
            correctAnswer: true,
            explanation: 'Yes! The Book of Psalms contains 150 psalms - prayers and hymns used in worship.'
          }
        ],
        completed: false
      },
      {
        id: 3,
        title: 'Structure of the Catholic Bible: New Testament',
        content: `The New Testament contains 27 books, divided into four main sections:

The Gospels – 4 books:
• Matthew: Written for Jews, emphasizes Jesus as the fulfillment of Old Testament prophecies
• Mark: The shortest Gospel, emphasizes action and Jesus as the suffering servant
• Luke: Written for Gentiles, emphasizes Jesus' mercy and concern for the poor
• John: The most theological, emphasizes Jesus' divinity and eternal life
• The word "Gospel" means "Good News" - the good news of salvation in Jesus Christ

Acts of the Apostles – 1 book:
• Written by Luke as a sequel to his Gospel
• Tells the story of the early Church after Jesus' ascension
• Shows how the apostles spread the Gospel
• Describes the coming of the Holy Spirit at Pentecost

Letters/Epistles – 21 books:
• Pauline Letters (13-14 books): Romans, 1-2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1-2 Thessalonians, 1-2 Timothy, Titus, Philemon, (Hebrews - authorship debated)
• Catholic (General) Epistles: James, 1-2 Peter, 1-2-3 John, Jude
• Letters written to early Christian communities to teach, encourage, and correct
• Address specific issues and provide guidance for Christian living

Book of Revelation – 1 book:
• Also called the Apocalypse
• Written by John, uses symbolic language
• Describes the end times and the victory of Christ
• Gives hope to persecuted Christians
• Points to the new heaven and new earth`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'How many books are in the New Testament?',
            options: ['21', '27', '39', '46'],
            correctAnswer: 1,
            explanation: 'The New Testament contains 27 books: 4 Gospels, 1 Acts, 21 Letters, and 1 Revelation.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The word "_____" means "Good News" - the good news of salvation in Jesus Christ.',
            correctAnswer: 'Gospel',
            explanation: 'Gospel means "Good News" - the four Gospels tell the good news of Jesus Christ and our salvation.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Book of Revelation describes the end times and gives hope to persecuted Christians.',
            correctAnswer: true,
            explanation: 'Yes! Revelation uses symbolic language to describe the victory of Christ and the new heaven and new earth.'
          }
        ],
        completed: false
      },
      {
        id: 4,
        title: 'The Catholic Bible vs. Other Bibles',
        content: `The Deuterocanonical Books (7 additional OT books):
• These books are in the Catholic Bible but not in most Protestant Bibles:
  1. Tobit
  2. Judith
  3. Wisdom (Wisdom of Solomon)
  4. Sirach (Ecclesiasticus)
  5. Baruch
  6. 1 Maccabees
  7. 2 Maccabees
• Also additions to Esther and Daniel
• Called "deuterocanonical" (second canon) because they were accepted later
• Called "Apocrypha" by Protestants (meaning "hidden" or "doubtful")

Why Protestant Bibles have 66 books vs. Catholic 73 books:
• During the Reformation, Martin Luther removed these 7 books
• He questioned their canonicity because they weren't in the Hebrew Bible
• However, they were in the Greek Septuagint (used by early Christians)
• The Catholic Church kept them because they were in the early Christian canon

History of the biblical canon:
• "Canon" means "rule" or "standard" - the official list of inspired books
• The Old Testament canon was settled by the time of Jesus
• The New Testament canon was finalized in the 4th century
• The Council of Trent (1546) officially confirmed the 73-book canon

The role of the Church in determining the canon:
• The Church, guided by the Holy Spirit, determined which books are inspired
• The Church didn't create the canon - it recognized what God had inspired
• The same authority that wrote the New Testament determined its canon
• Without the Church, we wouldn't know which books belong in the Bible`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'How many additional books does the Catholic Bible have compared to most Protestant Bibles?',
            options: ['5', '7', '10', 'None'],
            correctAnswer: 1,
            explanation: 'The Catholic Bible has 7 additional books in the Old Testament called the deuterocanonical books.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The word "_____" means "rule" or "standard" - the official list of inspired books.',
            correctAnswer: 'canon',
            explanation: 'Canon means the official list of books that the Church recognizes as inspired Scripture.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Church determined which books belong in the Bible, guided by the Holy Spirit.',
            correctAnswer: true,
            explanation: 'Yes! The Church, guided by the Holy Spirit, recognized which books are inspired and belong in the canon.'
          }
        ],
        completed: false
      },
      {
        id: 5,
        title: 'Divine Inspiration and Inerrancy',
        content: `What "inspired by God" means (2 Timothy 3:16):
• "All Scripture is inspired by God" (theopneustos - "God-breathed")
• God is the primary author - the Bible is truly God's Word
• Human writers are secondary authors - they wrote in their own style and language
• The Holy Spirit guided them to write what God wanted, without error

God as primary author, human writers as secondary authors:
• God is the ultimate source of the Bible's content
• Human authors used their own knowledge, experiences, and writing styles
• God worked through their humanity to communicate his message
• This is why different books have different styles (e.g., poetry vs. history)

Biblical inerrancy: truth without error in matters of salvation:
• The Bible is without error in what it teaches about salvation
• It is true in matters of faith and morals
• It may contain historical or scientific details from the human author's perspective
• The important thing is the religious truth, not scientific precision

Difference between literal truth and literary forms:
• We must understand the literary form (genre) to interpret correctly
• Poetry uses figurative language (not literal)
• Parables are stories to teach truth (not historical events)
• Historical books record events (but from a faith perspective)
• We read each book according to its literary form
• Example: Genesis 1 is not a scientific account but a theological statement about God as Creator`,
        questions: [
          {
            id: 1,
            type: 'fill-blank',
            question: '2 Timothy 3:16 says "All Scripture is _____ by God."',
            correctAnswer: 'inspired',
            explanation: 'The Bible is inspired (God-breathed) - God is the primary author, working through human writers.'
          },
          {
            id: 2,
            type: 'multiple-choice',
            question: 'What does biblical inerrancy mean?',
            options: ['The Bible has no errors at all, even in science', 'The Bible is without error in matters of salvation, faith, and morals', 'The Bible is mostly true', 'Only the New Testament is true'],
            correctAnswer: 1,
            explanation: 'Biblical inerrancy means the Bible is without error in what it teaches about salvation, faith, and morals.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'We must understand the literary form (genre) to interpret the Bible correctly.',
            correctAnswer: true,
            explanation: 'Yes! We read poetry as poetry, history as history, parables as parables - each according to its literary form.'
          }
        ],
        completed: false
      },
      {
        id: 6,
        title: 'How Catholics Interpret Scripture: The Three Criteria',
        content: `Catholics interpret Scripture using three criteria from Dei Verbum (Vatican II document):

Attention to the content and unity of the whole Scripture:
• We can't take verses out of context
• All of Scripture works together as one story
• The Old Testament prepares for the New Testament
• The New Testament fulfills the Old Testament
• We interpret difficult passages in light of clearer ones
• Example: We understand the Old Testament through the lens of Christ

Reading Scripture within the living Tradition of the Church:
• We don't interpret the Bible in isolation
• We read it within 2,000 years of Church teaching
• The Church Fathers, saints, and councils help us understand
• Tradition helps us avoid errors and heresies
• The same Holy Spirit who inspired Scripture guides the Church
• Example: The Church's teaching on the Real Presence helps us understand John 6

Attention to the analogy of faith:
• All truths of faith are connected and consistent
• Scripture must be interpreted in harmony with other Catholic teachings
• One truth of faith cannot contradict another
• We interpret unclear passages in light of clear Church teaching
• The Creed, sacraments, and moral teaching all work together
• Example: Our understanding of marriage in Scripture aligns with Church teaching on Matrimony`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'How many criteria do Catholics use to interpret Scripture?',
            options: ['One', 'Two', 'Three', 'Four'],
            correctAnswer: 2,
            explanation: 'Catholics use three criteria: content and unity of Scripture, living Tradition, and analogy of faith.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'We read Scripture within the living _____ of the Church, not in isolation.',
            correctAnswer: 'Tradition',
            explanation: 'We interpret Scripture within the living Tradition of the Church - 2,000 years of teaching and guidance.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The analogy of faith means all truths of faith are connected and consistent.',
            correctAnswer: true,
            explanation: 'Yes! The analogy of faith means Scripture must be interpreted in harmony with all Catholic teachings.'
          }
        ],
        completed: false
      },
      {
        id: 7,
        title: 'The Four Senses of Scripture',
        content: `Catholics recognize four senses (levels of meaning) in Scripture:

Literal sense – what the text actually says:
• The most important sense - the foundation
• What the human author intended to communicate
• The historical, grammatical meaning
• Example: "Jesus walked on water" means Jesus literally walked on water

Allegorical sense – deeper spiritual meaning:
• How the text points to Christ and the Church
• Old Testament events prefigure New Testament realities
• Example: The Passover lamb points to Christ, the Lamb of God
• Example: The crossing of the Red Sea prefigures Baptism

Moral sense – how it guides our lives:
• What the text teaches us about how to live
• The ethical and moral lessons
• How to apply Scripture to our daily lives
• Example: The Good Samaritan teaches us to love our neighbor
• Example: The Beatitudes show us how to be happy

Anagogical sense – eternal/heavenly significance:
• How the text points to our final destiny (heaven)
• The eschatological (end times) meaning
• What it tells us about eternal life
• Example: The Promised Land points to heaven
• Example: The wedding feast parables point to the heavenly banquet

All four senses work together to give us the full meaning of Scripture.`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is the most important sense of Scripture?',
            options: ['Allegorical', 'Moral', 'Literal', 'Anagogical'],
            correctAnswer: 2,
            explanation: 'The literal sense is the foundation - what the text actually says. The other senses build on this.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The _____ sense shows how the text points to Christ and the Church.',
            correctAnswer: 'allegorical',
            explanation: 'The allegorical sense reveals how Old Testament events prefigure Christ and the Church.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The anagogical sense points to our final destiny in heaven.',
            correctAnswer: true,
            explanation: 'Yes! The anagogical sense shows the eternal, heavenly meaning - how Scripture points to heaven.'
          }
        ],
        completed: false
      },
      {
        id: 8,
        title: 'Sacred Scripture and Sacred Tradition',
        content: `The relationship between Bible and Tradition:
• Scripture and Tradition are not in competition - they work together
• Both come from the same source: Divine Revelation
• Both are necessary for understanding God's full revelation
• Tradition helps us understand and interpret Scripture
• Scripture confirms and clarifies Tradition

Why "Scripture alone" (sola scriptura) is not Catholic teaching:
• The Bible itself doesn't say "Scripture alone"
• The Bible tells us to hold to both Scripture and Tradition (2 Thessalonians 2:15)
• Many Christian beliefs aren't explicitly in Scripture (e.g., the Trinity, the canon of Scripture itself)
• The early Church existed before the New Testament was written
• The Church wrote and determined the canon of Scripture
• Without Tradition, we wouldn't know which books belong in the Bible

The role of the Magisterium (teaching authority):
• The Magisterium is the Pope and bishops teaching in union with him
• They interpret Scripture authentically (with authority)
• They protect us from false interpretations
• They are guided by the Holy Spirit
• They cannot contradict Scripture or previous infallible teachings

How Tradition helps us understand Scripture:
• Tradition preserves the apostles' teaching
• It shows us how the early Church understood Scripture
• It provides context and interpretation
• It helps us avoid errors and heresies
• Example: Tradition helps us understand that "This is my Body" means the Real Presence`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is the relationship between Scripture and Tradition?',
            options: ['They compete with each other', 'They work together as two sources of Divine Revelation', 'Only Scripture matters', 'Tradition replaces Scripture'],
            correctAnswer: 1,
            explanation: 'Scripture and Tradition work together as two sources of Divine Revelation - both are necessary and complement each other.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The _____ is the Pope and bishops teaching in union with him.',
            correctAnswer: 'Magisterium',
            explanation: 'The Magisterium is the teaching authority of the Church - the Pope and bishops who interpret Scripture authentically.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Bible itself doesn\'t teach "Scripture alone" - it tells us to hold to both Scripture and Tradition.',
            correctAnswer: true,
            explanation: 'Yes! 2 Thessalonians 2:15 tells us to hold to both the traditions and the written word.'
          }
        ],
        completed: false
      },
      {
        id: 9,
        title: 'The Role of the Church in Reading Scripture',
        content: `Why Catholics don't interpret the Bible privately:
• Private interpretation led to thousands of Protestant denominations
• The Bible warns against private interpretation (2 Peter 1:20)
• We need the guidance of the Church that Jesus established
• The same Holy Spirit who inspired Scripture guides the Church
• Individual interpretation can lead to error and division

The Church as guardian and interpreter:
• Jesus gave the Church authority to teach (Matthew 16:18-19, 18:18)
• The Church protects and preserves the true meaning of Scripture
• The Church has faithfully passed down the faith for 2,000 years
• The Church helps us avoid false interpretations

The role of the Pope and bishops:
• The Pope and bishops are successors of the apostles
• They have the authority to interpret Scripture authentically
• They teach in union with the whole Church
• They are guided by the Holy Spirit
• Their teaching on faith and morals is protected from error

Papal encyclicals on Scripture:
• Divino Afflante Spiritu (1943): Encouraged study of original languages and literary forms
• Dei Verbum (1965): Vatican II document on Divine Revelation
  - Emphasized the importance of Scripture
  - Explained the relationship between Scripture and Tradition
  - Encouraged Catholics to read the Bible regularly
  - Provided principles for interpretation`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'Why don\'t Catholics interpret the Bible privately?',
            options: ['Catholics can\'t read', 'We need the guidance of the Church that Jesus established', 'The Bible is too hard', 'Only priests can read'],
            correctAnswer: 1,
            explanation: 'We need the Church\'s guidance because Jesus gave the Church authority to interpret Scripture, and private interpretation can lead to error.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The _____ document Dei Verbum emphasized the importance of Scripture and encouraged Catholics to read it regularly.',
            correctAnswer: 'Vatican II',
            explanation: 'Dei Verbum is a Vatican II document that renewed Catholic emphasis on Scripture study.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Pope and bishops have authority to interpret Scripture authentically, guided by the Holy Spirit.',
            correctAnswer: true,
            explanation: 'Yes! The Pope and bishops, as successors of the apostles, have the authority to interpret Scripture with the guidance of the Holy Spirit.'
          }
        ],
        completed: false
      },
      {
        id: 10,
        title: 'Literary Forms and Genres in the Bible',
        content: `Understanding literary forms (genres) is essential for interpreting the Bible correctly:

Historical narrative (e.g., Exodus, Acts):
• Records actual historical events
• Written from a faith perspective
• May include dialogue and details from the author's perspective
• Example: The Exodus from Egypt really happened

Poetry (e.g., Psalms, Song of Songs):
• Uses figurative language, not always literal
• Expresses emotions and praise
• Uses parallelism and imagery
• Example: "The Lord is my shepherd" is poetry, not literal

Prophecy (e.g., Isaiah, Jeremiah):
• Proclaims God's message to his people
• Often uses symbolic language
• Calls people to repentance
• Foretells future events (especially the Messiah)
• Example: Isaiah's prophecies about the suffering servant

Wisdom literature (e.g., Proverbs, Ecclesiastes):
• Teaches practical wisdom for living
• Uses sayings, proverbs, and reflections
• Not always absolute rules but general principles
• Example: "Train up a child in the way he should go"

Parables (e.g., Gospels):
• Stories Jesus told to teach truth
• Not historical events but fictional stories with a message
• Use everyday situations to reveal spiritual truth
• Example: The Parable of the Good Samaritan

Apocalyptic literature (e.g., Daniel, Revelation):
• Uses highly symbolic language
• Describes cosmic battles and end times
• Not meant to be read literally
• Gives hope in times of persecution
• Example: The Book of Revelation

Why understanding genre matters for interpretation:
• We read poetry as poetry, not as history
• We read parables as stories, not as literal events
• We read apocalyptic as symbolic, not as a literal timeline
• Misunderstanding genre leads to misinterpretation`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What literary form uses highly symbolic language to describe end times?',
            options: ['Historical narrative', 'Poetry', 'Apocalyptic literature', 'Wisdom literature'],
            correctAnswer: 2,
            explanation: 'Apocalyptic literature (like Revelation) uses symbolic language to describe cosmic battles and end times.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: '_____ are stories Jesus told to teach truth, not historical events.',
            correctAnswer: 'Parables',
            explanation: 'Parables are fictional stories with a spiritual message - we don\'t read them as literal historical events.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Understanding the literary form (genre) is essential for interpreting the Bible correctly.',
            correctAnswer: true,
            explanation: 'Yes! We must read poetry as poetry, history as history, and parables as stories - each according to its genre.'
          }
        ],
        completed: false
      },
      {
        id: 11,
        title: 'The Bible in the Liturgy',
        content: `The Liturgy of the Word in Mass:
• Every Mass includes readings from Scripture
• We don't just read the Bible - we hear it proclaimed
• The Word of God is alive and active (Hebrews 4:12)
• Hearing Scripture in community is different from private reading

The Lectionary and its cycle (Years A, B, C):
• The Lectionary is the book containing all Mass readings
• Three-year cycle for Sundays (Years A, B, C)
  - Year A: Mostly Matthew's Gospel
  - Year B: Mostly Mark's Gospel
  - Year C: Mostly Luke's Gospel
  - John's Gospel appears in all three years (especially during Easter and Lent)
• Two-year cycle for weekdays
• This ensures we hear most of the Bible over time

Why Catholics hear the Bible proclaimed, not just read:
• Proclamation makes the Word present in a special way
• Hearing together unites us as a community
• The reader acts as Christ's voice
• It's an encounter with the living Word
• The Word becomes present through proclamation

Responding to God's Word:
• Homily: The priest or deacon explains and applies the readings
• Creed: We profess our faith in response to God's Word
• Prayers of the Faithful: We pray for needs in response to the Word
• The entire Mass is a response to God's Word
• We are called to live what we hear`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'How many years are in the Sunday Lectionary cycle?',
            options: ['One', 'Two', 'Three', 'Four'],
            correctAnswer: 2,
            explanation: 'The Sunday Lectionary has a three-year cycle (Years A, B, C) covering Matthew, Mark, and Luke respectively.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The _____ is the book containing all the Mass readings.',
            correctAnswer: 'Lectionary',
            explanation: 'The Lectionary organizes all Scripture readings for Mass in a systematic cycle.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Hearing Scripture proclaimed at Mass is an encounter with the living Word of God.',
            correctAnswer: true,
            explanation: 'Yes! When Scripture is proclaimed at Mass, the Word becomes present in a special way - it\'s an encounter with the living God.'
          }
        ],
        completed: false
      },
      {
        id: 12,
        title: 'How to Read the Bible as a Catholic: Practical Tips',
        content: `Practical Tips for Reading the Bible:

Start with the Gospels:
• The Gospels are the heart of the Bible
• They tell us about Jesus, who is the center of our faith
• They're easier to understand than some Old Testament books
• Read one Gospel all the way through
• Then read Acts to see how the Church began

Use a Catholic translation:
• NABRE (New American Bible, Revised Edition): Used in US Masses
• RSV-CE (Revised Standard Version, Catholic Edition): Popular for study
• Douay-Rheims: Traditional English translation
• Avoid Protestant-only translations that may have bias
• Catholic translations include the deuterocanonical books

Read with the footnotes and introductions:
• Catholic Bibles have helpful footnotes
• Introductions explain the book's context and purpose
• They help us understand the historical and theological background
• They guide us in proper interpretation

Pray before reading (invoke the Holy Spirit):
• Ask the Holy Spirit to guide your reading
• Pray: "Come, Holy Spirit, enlighten my mind and heart"
• The same Spirit who inspired Scripture will help you understand
• Reading the Bible is a form of prayer
• Be open to what God wants to teach you

Other tips:
• Read regularly, even if just a little each day
• Read in a quiet place where you can focus
• Keep a journal of insights and questions
• Join a Bible study group
• Read with the Church - follow the daily Mass readings`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'Where should Catholics start when reading the Bible?',
            options: ['Genesis', 'Revelation', 'The Gospels', 'The Psalms'],
            correctAnswer: 2,
            explanation: 'Start with the Gospels - they tell us about Jesus, who is the center of our faith, and they\'re more accessible.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'Before reading the Bible, we should pray and invoke the _____ Spirit.',
            correctAnswer: 'Holy',
            explanation: 'We should ask the Holy Spirit to guide our reading - the same Spirit who inspired Scripture will help us understand.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Catholics should use Catholic translations that include the deuterocanonical books.',
            correctAnswer: true,
            explanation: 'Yes! Use Catholic translations like NABRE or RSV-CE that include all 73 books of the Catholic Bible.'
          }
        ],
        completed: false
      },
      {
        id: 13,
        title: 'Tools for Bible Study',
        content: `Catholic Study Bibles:
• Include introductions to each book
• Have footnotes explaining difficult passages
• Provide cross-references to related verses
• Explain Catholic teaching on various topics
• Examples: Ignatius Study Bible, Didache Bible, NABRE Study Bible

Catechism of the Catholic Church:
• Explains how the Church interprets Scripture
• Shows how Bible passages relate to Catholic teaching
• Provides the official teaching on faith and morals
• Has extensive Scripture references
• Helps us understand the Bible in light of Church teaching

Commentaries by Church Fathers and saints:
• Early Church Fathers (like Augustine, Jerome, John Chrysostom) wrote extensively on Scripture
• Saints throughout history have provided insights
• Their writings help us understand how the Church has always interpreted Scripture
• They show the continuity of Catholic teaching
• Modern Catholic commentaries build on this tradition

Parish Bible studies and groups:
• Studying with others helps us learn
• We can discuss and ask questions
• Others may have insights we miss
• It builds community and fellowship
• Many parishes offer Bible study programs
• Online Catholic Bible studies are also available

Other helpful tools:
• Concordances: Find where words appear in the Bible
• Bible dictionaries: Understand terms and concepts
• Maps and timelines: Visualize biblical history
• Catholic apps: Daily readings, study tools, commentaries`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What does the Catechism of the Catholic Church help us with?',
            options: ['Only prayer', 'Understanding how the Church interprets Scripture and relates it to Catholic teaching', 'Only sacraments', 'Only morality'],
            correctAnswer: 1,
            explanation: 'The Catechism explains how the Church interprets Scripture and shows how Bible passages relate to Catholic teaching.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The early _____ Fathers wrote extensively on Scripture and help us understand how the Church has always interpreted it.',
            correctAnswer: 'Church',
            explanation: 'The Church Fathers (like Augustine and Jerome) provide insights into how the Church has interpreted Scripture throughout history.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Studying the Bible with others in a group can help us learn and grow.',
            correctAnswer: true,
            explanation: 'Yes! Bible study groups provide community, discussion, and different perspectives that help us understand Scripture better.'
          }
        ],
        completed: false
      },
      {
        id: 14,
        title: 'Common Misunderstandings About Catholics and the Bible',
        content: `"Catholics don't read the Bible" – addressing the myth:
• This is completely false!
• Catholics have always valued Scripture
• The Mass is full of Scripture readings
• Many saints were great Scripture scholars
• The Church has preserved and copied the Bible for 2,000 years

Why Catholics weren't encouraged to read alone in the past:
• Before printing, Bibles were extremely expensive
• Most people couldn't read
• The Church wanted to ensure proper interpretation
• People heard Scripture at Mass (which was in Latin)
• This was practical, not theological

The renewal of biblical study after Vatican II:
• Dei Verbum (1965) encouraged all Catholics to read Scripture
• The Bible was translated into modern languages
• Bible studies became common in parishes
• Catholics began reading the Bible personally
• Biblical scholarship flourished

Catholic biblical scholarship today:
• Catholic scholars are leaders in biblical studies
• They use modern methods (archaeology, linguistics, history)
• They remain faithful to Church teaching
• They contribute to understanding the original meaning
• Catholic universities have excellent biblical programs
• The Pontifical Biblical Commission guides Catholic scholarship

The truth:
• Catholics DO read the Bible - at Mass, in prayer, and in study
• The Church encourages Bible reading
• Scripture is central to Catholic faith and worship
• Catholics have a rich tradition of biblical interpretation`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'Why weren\'t Catholics always encouraged to read the Bible alone in the past?',
            options: ['The Church didn\'t want people to read', 'Bibles were expensive, most couldn\'t read, and the Church wanted proper interpretation', 'The Bible was forbidden', 'Only priests could read'],
            correctAnswer: 1,
            explanation: 'Before printing, Bibles were rare and expensive, most people were illiterate, and the Church wanted to ensure proper interpretation.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The Vatican II document _____ encouraged all Catholics to read Scripture.',
            correctAnswer: 'Dei Verbum',
            explanation: 'Dei Verbum (1965) renewed the Church\'s emphasis on Scripture and encouraged all Catholics to read the Bible.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Catholics DO read the Bible - at Mass, in prayer, and in study.',
            correctAnswer: true,
            explanation: 'Yes! The myth that Catholics don\'t read the Bible is false. Scripture is central to Catholic faith, worship, and study.'
          }
        ],
        completed: false
      },
      {
        id: 15,
        title: 'Key Biblical Themes in Catholic Teaching',
        content: `Creation and the Fall:
• Genesis 1-3: God creates everything good, but sin enters through disobedience
• Shows God's love and human free will
• Points to our need for a Savior
• Foundation for understanding original sin and redemption

Covenant and Promise:
• God makes covenants with Noah, Abraham, Moses, David
• Each covenant prepares for the New Covenant in Christ
• Shows God's faithfulness despite human unfaithfulness
• The Eucharist is the New Covenant (Luke 22:20)

Incarnation: The Word Made Flesh (John 1:14):
• "The Word became flesh and dwelt among us"
• Jesus is both fully God and fully human
• God entered human history to save us
• The ultimate expression of God's love

Redemption and Salvation:
• Jesus died and rose to save us from sin
• Through his sacrifice, we are redeemed
• Salvation is a gift, not something we earn
• We are saved by grace through faith and good works

The Kingdom of God:
• Jesus preached the coming of God's kingdom
• It's both present (in the Church) and future (in heaven)
• We're called to live as citizens of the kingdom now
• Parables teach us about the kingdom

The Church as the Body of Christ:
• Paul describes the Church as Christ's body (1 Corinthians 12)
• We are members, each with different gifts
• Christ is the head, we are the members
• Shows our unity and interdependence

The Eucharist in Scripture:
• The Last Supper accounts (Matthew 26, Mark 14, Luke 22, 1 Corinthians 11)
• "This is my Body" - the Real Presence
• John 6: "Unless you eat my flesh and drink my blood"
• The Eucharist is central to Catholic faith`,
        questions: [
          {
            id: 1,
            type: 'fill-blank',
            question: 'John 1:14 says "The Word became _____ and dwelt among us."',
            correctAnswer: 'flesh',
            explanation: 'The Incarnation means God became human - "The Word became flesh" - showing God\'s ultimate love for us.'
          },
          {
            id: 2,
            type: 'multiple-choice',
            question: 'What does Paul call the Church?',
            options: ['An organization', 'The Body of Christ', 'A building', 'A club'],
            correctAnswer: 1,
            explanation: 'Paul describes the Church as the Body of Christ - we are members, each with different gifts, and Christ is the head.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Eucharist is found in Scripture, especially in the Last Supper accounts and John 6.',
            correctAnswer: true,
            explanation: 'Yes! The Eucharist is clearly taught in Scripture - at the Last Supper and in John 6 where Jesus insists we must eat his flesh.'
          }
        ],
        completed: false
      },
      {
        id: 16,
        title: 'Praying with Scripture: Lectio Divina',
        content: `What is Lectio Divina?
• "Divine Reading" - a way of praying with Scripture
• An ancient practice of the Church
• Not just reading, but encountering God
• A way to let Scripture transform us
• Used by monks, saints, and ordinary Catholics

The four steps:

Lectio (Reading):
• Read a passage slowly and carefully
• Read it more than once
• Notice words or phrases that stand out
• Don't rush - take your time
• Choose a short passage (a few verses)

Meditatio (Meditation):
• Reflect on what you've read
• Ask: "What is God saying to me?"
• Think about how it applies to your life
• Let the words sink in
• Consider the context and meaning

Oratio (Prayer):
• Respond to God in prayer
• Talk to God about what you've read
• Thank him, ask for help, express your feelings
• Be honest and open
• Let your heart speak to God

Contemplatio (Contemplation):
• Rest in God's presence
• Be still and silent
• Let God speak to your heart
• Don't try to think or analyze
• Just be with God

How to practice it daily:
• Set aside 15-30 minutes
• Choose a passage (maybe the daily Mass reading)
• Follow the four steps
• Don't worry if it feels difficult at first
• The goal is relationship with God, not perfection
• Practice makes it easier`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'How many steps are in Lectio Divina?',
            options: ['Two', 'Three', 'Four', 'Five'],
            correctAnswer: 2,
            explanation: 'Lectio Divina has four steps: Lectio (Reading), Meditatio (Meditation), Oratio (Prayer), and Contemplatio (Contemplation).'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'Lectio Divina means "_____ Reading" - a way of praying with Scripture.',
            correctAnswer: 'Divine',
            explanation: 'Lectio Divina (Divine Reading) is an ancient way of praying with Scripture that helps us encounter God.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The goal of Lectio Divina is relationship with God, not perfection.',
            correctAnswer: true,
            explanation: 'Yes! Lectio Divina is about encountering God and growing in relationship with him, not about doing it perfectly.'
          }
        ],
        completed: false
      },
      {
        id: 17,
        title: 'The Bible and Catholic Devotions',
        content: `The Rosary and Scripture:
• Each mystery of the Rosary is based on Scripture
• Joyful Mysteries: Annunciation, Visitation, Nativity, Presentation, Finding in Temple
• Sorrowful Mysteries: Agony, Scourging, Crowning, Carrying Cross, Crucifixion
• Glorious Mysteries: Resurrection, Ascension, Pentecost, Assumption, Coronation
• Luminous Mysteries: Baptism, Wedding at Cana, Proclamation of Kingdom, Transfiguration, Institution of Eucharist
• The Rosary helps us meditate on Scripture

Stations of the Cross:
• Based on Jesus' passion and death
• Follows the events of Good Friday
• Each station is a scene from the Gospels
• Helps us walk with Jesus to Calvary
• Combines Scripture with prayer and meditation

Scripture-based novenas:
• Novenas are nine days of prayer
• Many are based on Scripture
• Example: The Divine Mercy Novena (based on Jesus' revelations to St. Faustina)
• Novenas help us focus on specific Scripture passages
• They combine reading, prayer, and reflection

Biblical roots of Catholic prayers:
• Hail Mary: Combines Luke 1:28 ("Hail, full of grace") and Luke 1:42 ("Blessed are you among women")
• Magnificat: Mary's prayer from Luke 1:46-55
• Our Father: Taught by Jesus in Matthew 6:9-13 and Luke 11:2-4
• Glory Be: Based on Trinitarian theology from Scripture
• Many prayers come directly from Scripture

The Bible enriches all Catholic devotions:
• Scripture gives them meaning and depth
• They help us live out Scripture in our daily lives
• They connect us to the biblical story
• They make Scripture part of our prayer life`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What Catholic prayer combines verses from Luke\'s Gospel about Mary?',
            options: ['Our Father', 'Hail Mary', 'Glory Be', 'Apostles\' Creed'],
            correctAnswer: 1,
            explanation: 'The Hail Mary combines Luke 1:28 ("Hail, full of grace") and Luke 1:42 ("Blessed are you among women").'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The _____ of the Cross follows the events of Jesus\' passion from the Gospels.',
            correctAnswer: 'Stations',
            explanation: 'The Stations of the Cross are based on the Gospel accounts of Jesus\' passion and death.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Many Catholic prayers, like the Our Father, come directly from Scripture.',
            correctAnswer: true,
            explanation: 'Yes! The Our Father was taught by Jesus, the Hail Mary comes from Luke\'s Gospel, and many other prayers have biblical roots.'
          }
        ],
        completed: false
      },
      {
        id: 18,
        title: 'Summary and Invitation',
        content: `The Bible as God's love letter to humanity:
• The Bible is not just a book - it's God's Word to us
• It reveals God's love, plan, and desire for us
• Every page shows God's care for his people
• It's a love story from creation to eternity
• God speaks to us through Scripture

Encouragement to read Scripture daily:
• Make Bible reading a daily habit
• Even 10-15 minutes a day makes a difference
• Start with the Gospels or daily Mass readings
• Use Lectio Divina to pray with Scripture
• Join a Bible study group
• The more you read, the more you'll want to read

The Bible and the Eucharist: Word and Sacrament:
• At Mass, we receive both Word and Sacrament
• The Liturgy of the Word prepares us for the Liturgy of the Eucharist
• Scripture and Eucharist work together
• Both are encounters with Christ
• Both nourish our souls
• We need both to grow in faith

Growing deeper in love with God's Word:
• Reading Scripture transforms us
• It changes how we think, act, and love
• It brings us closer to God
• It helps us know Jesus better
• It guides us in daily life
• It gives us hope and strength

Final thoughts:
• The Bible is a gift from God - use it!
• Read it with the Church, in Tradition
• Let it transform your life
• Share it with others
• Let God's Word be a lamp to your feet and a light to your path (Psalm 119:105)

The Bible is not just to be read - it's to be lived!`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What do we receive at Mass that work together?',
            options: ['Only the Eucharist', 'Only the Word', 'Both Word and Sacrament', 'Only prayers'],
            correctAnswer: 2,
            explanation: 'At Mass, we receive both the Word (Scripture) and the Sacrament (Eucharist) - both are encounters with Christ.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'Psalm 119:105 says God\'s Word is "a lamp to my _____ and a light to my path."',
            correctAnswer: 'feet',
            explanation: 'God\'s Word guides us in daily life - it\'s a lamp to our feet and a light to our path.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Bible is not just to be read - it\'s to be lived!',
            correctAnswer: true,
            explanation: 'Yes! Scripture should transform how we live - it\'s meant to change us and guide us in daily life.'
          }
        ],
        completed: false
      }
    ];
  }

  private getCourse31Lessons(): Lesson[] {
    return [
      {
        id: 1,
        title: 'Introduction to Latin',
        content: `What is Latin?

Latin is an ancient language that was originally spoken by the people of ancient Rome. It belongs to the Italic branch of the Indo-European language family. While Latin is no longer spoken as a native language, it remains highly influential and is still used in various contexts today.

Importance of Latin in the Catholic Church:

• Latin has been the official language of the Catholic Church for centuries
• It serves as a unifying language for the universal Church
• Many important Church documents, prayers, and liturgical texts are in Latin
• Latin connects Catholics across different cultures and languages

Latin as the language of the liturgy and tradition:

• The Roman Rite of the Mass was traditionally celebrated in Latin
• Sacred music, especially Gregorian chant, uses Latin texts
• Official Church documents (encyclicals, papal bulls) are often written in Latin
• Latin preserves the Church's theological and liturgical heritage

Pronunciation systems: Ecclesiastical vs. Classical:

• Ecclesiastical Latin: The pronunciation used by the Catholic Church, closer to Italian pronunciation
• Classical Latin: The reconstructed pronunciation used in academic settings
• For Catholics, Ecclesiastical Latin is the standard for liturgy and prayer

Why Catholics still use Latin today:

• Church documents: Official Vatican documents are often published in Latin
• Chants: Gregorian chant and sacred music use Latin texts
• Prayers: Many traditional prayers are in Latin
• Unity: Latin provides a common language for the universal Church
• Tradition: It connects us to centuries of Catholic heritage and worship`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What pronunciation system does the Catholic Church use for Latin?',
            options: ['Classical', 'Ecclesiastical', 'Medieval', 'Modern'],
            correctAnswer: 1,
            explanation: 'The Catholic Church uses Ecclesiastical Latin pronunciation, which is closer to Italian pronunciation.'
          },
          {
            id: 2,
            type: 'true-false',
            question: 'Latin is still used in official Church documents and liturgical texts today.',
            correctAnswer: true,
            explanation: 'Yes! Latin remains important in the Catholic Church for official documents, liturgy, and tradition.'
          },
          {
            id: 3,
            type: 'fill-blank',
            question: 'Latin serves as a _____ language for the universal Church.',
            correctAnswer: 'unifying',
            explanation: 'Latin unites Catholics across different cultures and languages, providing a common liturgical and theological language.'
          }
        ],
        completed: false
      },
      {
        id: 2,
        title: 'Basic Ecclesiastical Latin Pronunciation',
        content: `Alphabet and vowel sounds:

The Latin alphabet has 23 letters (no J, U, or W in classical Latin, though modern texts may use them):
• A, B, C, D, E, F, G, H, I, K, L, M, N, O, P, Q, R, S, T, V, X, Y, Z

Vowel sounds in Ecclesiastical Latin:
• A: "ah" as in "father"
• E: "eh" as in "bed"
• I: "ee" as in "see"
• O: "oh" as in "go"
• U: "oo" as in "moon"
• Y: "ee" (used in Greek loanwords)

Consonant rules:

• C: Before E, I, AE, OE: "ch" (as in "church")
  Before A, O, U: "k" (as in "cat")
• G: Before E, I, AE, OE: "j" (as in "joy")
  Before A, O, U: "g" (as in "go")
• GN: "ny" (as in "canyon") - e.g., "agnus" sounds like "AH-nyoos"
• TI: Before a vowel: "tsee" (as in "nation") - e.g., "gratia" sounds like "GRAH-tsee-ah"
• SC: Before E, I: "sh" (as in "ship")

Syllables and stress:

• Words are divided into syllables
• Stress usually falls on the second-to-last syllable (penultimate) if it's long, or the third-to-last if the penultimate is short
• In two-syllable words, stress the first syllable

Practice with common liturgical words:

• Dominus (DOH-mee-noos): Lord
• Christus (KREE-stoos): Christ
• Spiritus (SPEE-ree-toos): Spirit
• Sanctus (SAHNK-toos): Holy
• Gloria (GLOH-ree-ah): Glory
• Maria (mah-REE-ah): Mary`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'How does "C" sound before "E" or "I" in Ecclesiastical Latin?',
            options: ['Like "k"', 'Like "ch"', 'Like "s"', 'Like "ts"'],
            correctAnswer: 1,
            explanation: 'In Ecclesiastical Latin, "C" before "E" or "I" sounds like "ch" as in "church".'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The combination "GN" in Latin (as in "agnus") sounds like "_____" (as in "canyon").',
            correctAnswer: 'ny',
            explanation: 'GN produces the "ny" sound, so "agnus" is pronounced "AH-nyoos".'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'In Ecclesiastical Latin, "Gloria" is pronounced "GLOH-ree-ah".',
            correctAnswer: true,
            explanation: 'Yes! In Ecclesiastical Latin, vowels are pronounced clearly and "Gloria" has the stress on the first syllable.'
          }
        ],
        completed: false
      },
      {
        id: 3,
        title: 'Essential Latin Vocabulary for Catholics',
        content: `Basic greetings and simple phrases:

• Ave (AH-veh): Hail / Hello
• Pax (pahks): Peace
• Gratias (GRAH-tsee-ahs): Thanks
• Deo gratias (DEH-oh GRAH-tsee-ahs): Thanks be to God
• Amen (AH-men): So be it / I believe

Church-related vocabulary:

• Altare (ahl-TAH-reh): Altar
• Sacerdos (sah-CHEHR-dohs): Priest
• Sacramentum (sah-krah-MEN-toom): Sacrament
• Oratio (oh-RAH-tsee-oh): Prayer
• Ecclesia (eh-CLEH-see-ah): Church
• Missa (MEES-sah): Mass
• Eucharistia (eh-oo-kah-REE-stee-ah): Eucharist
• Confessio (kohn-FEHS-see-oh): Confession

Vocabulary from the Mass and the Bible:

• Verbum (VEHR-boom): Word
• Evangelium (eh-vahn-GEH-lee-oom): Gospel
• Lectio (LEHK-tsee-oh): Reading
• Credo (KREH-doh): I believe
• Sanctus (SAHNK-toos): Holy
• Benedictus (beh-nee-DEEK-toos): Blessed
• Agnus (AHG-noos): Lamb
• Panis (PAH-nees): Bread
• Vinum (VEE-noom): Wine

Latin roots in English and Filipino:

Many English words come from Latin:
• "Sanctify" from "sanctus" (holy)
• "Sacrament" from "sacramentum"
• "Confession" from "confessio"
• "Evangelical" from "evangelium"
• "Credible" from "credo" (I believe)

Filipino words with Latin origins:
• "Misa" from "Missa" (Mass)
• "Sakramento" from "Sacramentum"
• "Ebanghelyo" from "Evangelium"`,
        questions: [
          {
            id: 1,
            type: 'fill-blank',
            question: 'The Latin word "_____" means "Peace" and is used in the Mass.',
            correctAnswer: 'Pax',
            explanation: '"Pax" means peace and is used in phrases like "Pax Domini" (Peace of the Lord).'
          },
          {
            id: 2,
            type: 'multiple-choice',
            question: 'What does "Credo" mean?',
            options: ['I pray', 'I believe', 'I confess', 'I love'],
            correctAnswer: 1,
            explanation: '"Credo" means "I believe" and is the first word of the Apostles\' and Nicene Creeds.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Filipino word "Misa" comes from the Latin word "Missa".',
            correctAnswer: true,
            explanation: 'Yes! Many Filipino religious terms have Latin origins, including "Misa" from "Missa" (Mass).'
          }
        ],
        completed: false
      },
      {
        id: 4,
        title: 'Basic Grammar Foundations: Nouns, Verbs, and Adjectives',
        content: `A. Nouns

Gender: masculine, feminine, neuter

Latin nouns have three genders:
• Masculine: e.g., "Dominus" (Lord), "Christus" (Christ)
• Feminine: e.g., "Maria" (Mary), "Ecclesia" (Church)
• Neuter: e.g., "Verbum" (Word), "Sacramentum" (Sacrament)

Cases and their functions:

Latin nouns change form (decline) based on their function in a sentence:
• Nominative: Subject of the sentence (who/what does the action)
• Genitive: Possession ("of" something)
• Dative: Indirect object ("to/for" someone)
• Accusative: Direct object (receives the action)
• Ablative: Various uses (by, with, from, in, on)
• Vocative: Direct address (calling someone)

Declension overview:

Latin nouns are organized into five declensions based on their endings. Each declension has its own pattern of endings.

B. Verbs

Present tense:

The present tense describes actions happening now:
• "Oro" (I pray)
• "Credis" (you believe)
• "Sanctificat" (he/she/it sanctifies)

Basic verb conjugations:

Latin verbs are conjugated (change form) based on:
• Person (I, you, he/she/it, we, you all, they)
• Number (singular or plural)
• Tense (when the action happens)

Common verbs in prayers:

• "Credere" (to believe): Used in the Creed
• "Orare" (to pray): Used in many prayers
• "Sanctificare" (to sanctify): Used in the Our Father
• "Benedicere" (to bless): Used in blessings
• "Glorificare" (to glorify): Used in the Gloria

C. Adjectives

Agreement of adjective and noun:

Adjectives must agree with the noun they describe in:
• Gender (masculine, feminine, neuter)
• Number (singular or plural)
• Case (nominative, genitive, etc.)

Common adjectives used in prayers:

• "Sanctus" (holy, saint)
• "Benedictus" (blessed)
• "Gloriosus" (glorious)
• "Aeternus" (eternal)
• "Divinus" (divine)`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'How many genders do Latin nouns have?',
            options: ['Two', 'Three', 'Four', 'Five'],
            correctAnswer: 1,
            explanation: 'Latin nouns have three genders: masculine, feminine, and neuter.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The Latin verb "_____" means "to believe" and is used in the Creed.',
            correctAnswer: 'Credere',
            explanation: '"Credere" means "to believe" and is the root of "Credo" (I believe).'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Adjectives in Latin must agree with their nouns in gender, number, and case.',
            correctAnswer: true,
            explanation: 'Yes! Latin adjectives must match the noun they describe in gender, number, and case.'
          }
        ],
        completed: false
      },
      {
        id: 5,
        title: 'Latin in the Mass',
        content: `Key parts of the Mass in Latin:

Sign of the Cross:
"In nomine Patris, et Filii, et Spiritus Sancti. Amen."
(In the name of the Father, and of the Son, and of the Holy Spirit. Amen.)

Gloria:
"Gloria in excelsis Deo, et in terra pax hominibus bonae voluntatis."
(Glory to God in the highest, and on earth peace to people of good will.)

Sanctus:
"Sanctus, Sanctus, Sanctus, Dominus Deus Sabaoth. Pleni sunt caeli et terra gloria tua."
(Holy, Holy, Holy, Lord God of hosts. Heaven and earth are full of your glory.)

Agnus Dei:
"Agnus Dei, qui tollis peccata mundi, miserere nobis."
(Lamb of God, who takes away the sins of the world, have mercy on us.)

Pater Noster:
"Pater noster, qui es in caelis, sanctificetur nomen tuum..."
(Our Father, who art in heaven, hallowed be thy name...)

Practice:

Reading and pronouncing Mass responses:

• "Et cum spiritu tuo" (And with your spirit) - Response to "Dominus vobiscum"
• "Amen" (Amen) - Affirmation after prayers
• "Deo gratias" (Thanks be to God) - Response to "Ite, missa est"

Understanding meaning line-by-line:

When learning Latin prayers, it's helpful to:
• Break them down word by word
• Understand each word's meaning
• See how the words work together
• Practice pronunciation slowly
• Build up to full speed

Common Mass phrases:

• "Dominus vobiscum" (The Lord be with you)
• "Lift up your hearts" - "Sursum corda"
• "We lift them up to the Lord" - "Habemus ad Dominum"
• "Let us give thanks to the Lord our God" - "Gratias agamus Domino Deo nostro"`,
        questions: [
          {
            id: 1,
            type: 'fill-blank',
            question: 'The response to "Dominus vobiscum" is "Et cum _____ tuo" (And with your spirit).',
            correctAnswer: 'spiritu',
            explanation: '"Et cum spiritu tuo" is the traditional response meaning "And with your spirit."'
          },
          {
            id: 2,
            type: 'multiple-choice',
            question: 'What does "Agnus Dei" mean?',
            options: ['Lamb of God', 'Son of God', 'Word of God', 'Spirit of God'],
            correctAnswer: 0,
            explanation: '"Agnus Dei" means "Lamb of God" and refers to Jesus Christ.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The "Sanctus" is sung or said during the Eucharistic Prayer.',
            correctAnswer: true,
            explanation: 'Yes! The "Sanctus" (Holy, Holy, Holy) is part of the Eucharistic Prayer in the Mass.'
          }
        ],
        completed: false
      },
      {
        id: 6,
        title: 'Latin Prayers Every Catholic Should Know',
        content: `Signum Crucis (Sign of the Cross):

"In nomine Patris, et Filii, et Spiritus Sancti. Amen."
(In the name of the Father, and of the Son, and of the Holy Spirit. Amen.)

Pater Noster (Our Father):

"Pater noster, qui es in caelis,
sanctificetur nomen tuum.
Adveniat regnum tuum.
Fiat voluntas tua, sicut in caelo et in terra.
Panem nostrum quotidianum da nobis hodie,
et dimitte nobis debita nostra,
sicut et nos dimittimus debitoribus nostris.
Et ne nos inducas in tentationem,
sed libera nos a malo. Amen."

(Our Father, who art in heaven, hallowed be thy name. Thy kingdom come. Thy will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. Amen.)

Ave Maria (Hail Mary):

"Ave Maria, gratia plena, Dominus tecum.
Benedicta tu in mulieribus,
et benedictus fructus ventris tui, Iesus.
Sancta Maria, Mater Dei,
ora pro nobis peccatoribus,
nunc et in hora mortis nostrae. Amen."

(Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.)

Gloria Patri:

"Gloria Patri, et Filio, et Spiritui Sancto.
Sicut erat in principio, et nunc, et semper,
et in saecula saeculorum. Amen."

(Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.)

Confiteor (I Confess):

"Confiteor Deo omnipotenti... quia peccavi nimis..."
(I confess to almighty God... that I have sinned greatly...)

Credo (Apostles' or Nicene Creed):

"Credo in unum Deum, Patrem omnipotentem..."
(I believe in one God, the Father almighty...)`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What does "Ave Maria" mean?',
            options: ['Our Mother', 'Hail Mary', 'Blessed Virgin', 'Holy Mary'],
            correctAnswer: 1,
            explanation: '"Ave Maria" means "Hail Mary" and is the beginning of the Hail Mary prayer.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The prayer "Gloria _____" ends with "in saecula saeculorum. Amen."',
            correctAnswer: 'Patri',
            explanation: '"Gloria Patri" (Glory be to the Father) is a common doxology used in Catholic prayer.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The "Pater Noster" is the Latin name for the Our Father prayer.',
            correctAnswer: true,
            explanation: 'Yes! "Pater Noster" means "Our Father" and is the Latin version of the Lord\'s Prayer.'
          }
        ],
        completed: false
      },
      {
        id: 7,
        title: 'Introduction to Gregorian Chant',
        content: `What is Gregorian Chant?

Gregorian chant is the traditional music of the Roman Catholic Church. It is:
• Monophonic (single melodic line, no harmony)
• Unaccompanied (sung a cappella)
• Named after Pope Gregory I, who organized and codified the chants
• Used in the liturgy for over a thousand years
• Characterized by its flowing, meditative quality

Basics of chant notation:

Gregorian chant uses a special notation system:
• Four-line staff (instead of the modern five-line staff)
• Neumes: Special symbols that indicate groups of notes
• No time signature or barlines (free rhythm)
• Notes move stepwise, creating smooth melodies

Understanding neumes:

Neumes are the basic units of Gregorian chant notation:
• Single note: A single pitch
• Two-note neume: Two notes connected
• Three-note neume: Three notes in a group
• Special neumes indicate specific melodic patterns

Simple chant practice: Kyrie, Sanctus, Agnus Dei

Kyrie:
"Kyrie eleison" (Lord, have mercy)
"Christe eleison" (Christ, have mercy)
"Kyrie eleison" (Lord, have mercy)

Sanctus:
"Sanctus, Sanctus, Sanctus, Dominus Deus Sabaoth..."
(Holy, Holy, Holy, Lord God of hosts...)

Agnus Dei:
"Agnus Dei, qui tollis peccata mundi, miserere nobis..."
(Lamb of God, who takes away the sins of the world, have mercy on us...)

Why chant is important:

• Connects us to centuries of Catholic tradition
• Enhances the sacred atmosphere of the liturgy
• Helps us meditate on the words being sung
• Unites the Church across time and cultures
• Elevates the mind and heart to God`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'How many lines does a Gregorian chant staff have?',
            options: ['Three', 'Four', 'Five', 'Six'],
            correctAnswer: 1,
            explanation: 'Gregorian chant uses a four-line staff, unlike modern musical notation which uses five lines.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'Gregorian chant is named after Pope _____ I, who organized the chants.',
            correctAnswer: 'Gregory',
            explanation: 'Pope Gregory I (Gregory the Great) is credited with organizing and codifying Gregorian chant.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Gregorian chant is typically sung a cappella (without instruments).',
            correctAnswer: true,
            explanation: 'Yes! Gregorian chant is traditionally unaccompanied, sung a cappella to maintain its pure, meditative quality.'
          }
        ],
        completed: false
      },
      {
        id: 8,
        title: 'Reading the Latin Bible',
        content: `Vulgate introduction:

The Vulgate is the Latin translation of the Bible, primarily translated by St. Jerome in the 4th century:
• "Vulgate" means "common" or "popular" (vulgata)
• It became the standard Latin Bible of the Catholic Church
• Used for over a thousand years in the liturgy
• Still referenced in Church documents and theology
• The basis for many modern translations

Common biblical phrases in Latin:

• "In principio erat Verbum" (In the beginning was the Word) - John 1:1
• "Ecce Agnus Dei" (Behold the Lamb of God) - John 1:29
• "Ego sum via, veritas, et vita" (I am the way, the truth, and the life) - John 14:6
• "Dominus meus et Deus meus" (My Lord and my God) - John 20:28
• "Ave, gratia plena" (Hail, full of grace) - Luke 1:28
• "Fiat mihi secundum verbum tuum" (Be it done to me according to your word) - Luke 1:38

Recognizing liturgical scripture phrases:

Many phrases from the Latin Bible are used in the Mass and liturgy:
• "Verbum Domini" (The Word of the Lord) - said after readings
• "Deo gratias" (Thanks be to God) - response to readings
• "Per evangelica dicta" (Through the words of the Gospel) - prayer after Gospel
• "Laus tibi, Christe" (Praise to you, O Christ) - response to Gospel

Famous biblical passages in Latin:

The Lord's Prayer (Pater Noster) - Matthew 6:9-13
The Magnificat (Mary's song) - Luke 1:46-55
The Beatitudes - Matthew 5:3-12
The Last Supper narrative - Matthew 26:26-28

Why the Vulgate matters:

• Preserves the Church's scriptural tradition
• Used in official Church documents
• Basis for theological study
• Connects us to the early Church
• Still referenced in papal documents and encyclicals`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'Who primarily translated the Vulgate?',
            options: ['St. Augustine', 'St. Jerome', 'St. Thomas Aquinas', 'St. Benedict'],
            correctAnswer: 1,
            explanation: 'St. Jerome translated the Vulgate in the 4th century, making it the standard Latin Bible of the Church.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: '"Ecce _____ Dei" means "Behold the Lamb of God" (John 1:29).',
            correctAnswer: 'Agnus',
            explanation: '"Ecce Agnus Dei" is John the Baptist\'s declaration when he sees Jesus.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'The Vulgate is still referenced in official Church documents today.',
            correctAnswer: true,
            explanation: 'Yes! The Vulgate remains important and is still referenced in papal documents and theological works.'
          }
        ],
        completed: false
      },
      {
        id: 9,
        title: 'Liturgical Expressions and Phrases',
        content: `Dominus vobiscum / Et cum spiritu tuo:

"Dominus vobiscum" (The Lord be with you)
"Et cum spiritu tuo" (And with your spirit)

This exchange happens multiple times during Mass:
• At the beginning: Greeting
• Before the Gospel: Invitation to listen
• Before the Preface: Invitation to prayer
• Before the final blessing: Sending forth

Ite, missa est / Deo gratias:

"Ite, missa est" (Go, the Mass is ended / Go, you are sent)
"Deo gratias" (Thanks be to God)

This is the dismissal at the end of Mass, sending the faithful forth to live what they have received.

Pax Domini sit semper vobiscum:

"Pax Domini sit semper vobiscum" (The peace of the Lord be always with you)
Response: "Et cum spiritu tuo" (And with your spirit)

This is said before the Sign of Peace during Mass.

Learning context and meaning:

Understanding when these phrases are used helps us:
• Participate more fully in the Mass
• Understand the flow of the liturgy
• Connect the words to their meaning
• Appreciate the beauty of the Latin language
• Feel more connected to the universal Church

Other common liturgical phrases:

• "Oremus" (Let us pray) - Invitation to prayer
• "Per omnia saecula saeculorum" (For ever and ever) - Conclusion of prayers
• "Sursum corda" (Lift up your hearts) - Before the Eucharistic Prayer
• "Habemus ad Dominum" (We lift them up to the Lord) - Response
• "Dignum et iustum est" (It is right and just) - Response before Preface
• "Mysterium fidei" (The mystery of faith) - Acclamation after consecration`,
        questions: [
          {
            id: 1,
            type: 'fill-blank',
            question: 'The response to "Dominus vobiscum" is "Et cum _____ tuo".',
            correctAnswer: 'spiritu',
            explanation: '"Et cum spiritu tuo" means "And with your spirit" and is the traditional response.'
          },
          {
            id: 2,
            type: 'multiple-choice',
            question: 'What does "Ite, missa est" mean?',
            options: ['The Mass begins', 'Go, you are sent', 'Let us pray', 'Peace be with you'],
            correctAnswer: 1,
            explanation: '"Ite, missa est" means "Go, the Mass is ended" or "Go, you are sent" - it\'s the dismissal.'
          },
          {
            id: 3,
            type: 'true-false',
            question: '"Oremus" means "Let us pray" and is used to invite the congregation to prayer.',
            correctAnswer: true,
            explanation: 'Yes! "Oremus" is the Latin invitation to prayer, used throughout the Mass.'
          }
        ],
        completed: false
      },
      {
        id: 10,
        title: 'Translating Simple Latin Texts',
        content: `Simple phrases from prayers:

Let's practice translating common prayer phrases:

• "In nomine Patris" = In the name of the Father
• "Sancta Maria" = Holy Mary
• "Mater Dei" = Mother of God
• "Ora pro nobis" = Pray for us
• "Peccatoribus" = Sinners
• "Nunc et in hora mortis" = Now and at the hour of death

Short Scripture lines:

• "Verbum caro factum est" = The Word became flesh (John 1:14)
• "Ego sum panis vitae" = I am the bread of life (John 6:35)
• "Diliges Dominum Deum tuum" = You shall love the Lord your God (Matthew 22:37)
• "Venite ad me" = Come to me (Matthew 11:28)

Liturgical acclamations:

• "Sanctus, Sanctus, Sanctus" = Holy, Holy, Holy
• "Benedictus qui venit" = Blessed is he who comes
• "Hosanna in excelsis" = Hosanna in the highest
• "Dignus est Agnus" = Worthy is the Lamb

Step-by-step translation practice:

1. Identify the main verb (the action word)
2. Find the subject (who or what does the action)
3. Identify the object (what receives the action)
4. Look for adjectives and see what they modify
5. Consider the context (prayer, Mass, Scripture)
6. Put it all together in English

Example: "Sancta Maria, Mater Dei"

• "Sancta" = Holy (adjective, feminine, modifying Maria)
• "Maria" = Mary (noun, subject)
• "Mater" = Mother (noun)
• "Dei" = of God (genitive case)
• Translation: "Holy Mary, Mother of God"

Tips for translation:

• Start with words you recognize
• Use context clues (prayer, Mass setting)
• Remember common endings and their meanings
• Practice with familiar prayers first
• Build vocabulary gradually`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What does "Ora pro nobis" mean?',
            options: ['Pray for us', 'Our Father', 'Holy Mary', 'Thanks be to God'],
            correctAnswer: 0,
            explanation: '"Ora pro nobis" means "Pray for us" and is found in the Hail Mary and other prayers.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: '"Verbum _____ factum est" means "The Word became flesh" (John 1:14).',
            correctAnswer: 'caro',
            explanation: '"Verbum caro factum est" is one of the most important verses in the Bible, describing the Incarnation.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'When translating Latin, it helps to identify the main verb first.',
            correctAnswer: true,
            explanation: 'Yes! Finding the main verb helps you understand the sentence structure and meaning.'
          }
        ],
        completed: false
      },
      {
        id: 11,
        title: 'Latin in Church Documents',
        content: `Use of Latin in papal documents:

Many official Church documents are written in Latin:
• Encyclicals: Papal letters on important topics
• Apostolic constitutions: Major Church documents
• Papal bulls: Official decrees
• Motu proprio: Documents issued "on one's own initiative"
• Decrees from Vatican congregations

Understanding mottoes and inscriptions:

Many Church institutions have Latin mottoes:
• "Ad maiorem Dei gloriam" (For the greater glory of God) - Jesuit motto
• "Ora et labora" (Pray and work) - Benedictine motto
• "In hoc signo vinces" (In this sign you will conquer) - Associated with Constantine
• "Ecce homo" (Behold the man) - Words of Pilate about Jesus

Examples from encyclicals and councils:

Famous opening words of encyclicals:
• "Rerum Novarum" (Of New Things) - On labor and capital
• "Pacem in Terris" (Peace on Earth) - On peace
• "Humanae Vitae" (Of Human Life) - On human life
• "Deus Caritas Est" (God is Love) - On Christian love

Vatican II documents:
• "Sacrosanctum Concilium" (This Sacred Council) - On the liturgy
• "Lumen Gentium" (Light of the Nations) - On the Church
• "Gaudium et Spes" (Joy and Hope) - On the Church in the modern world

Why Latin in documents:

• Precision: Latin allows for exact theological expression
• Universality: Understood by scholars worldwide
• Tradition: Connects to the Church's historical documents
• Permanence: Latin doesn't change like modern languages
• Official language: Still the official language of the Vatican

Common document phrases:

• "In nomine Domini" (In the name of the Lord)
• "Ad perpetuam rei memoriam" (For the perpetual memory of the matter)
• "Datum Romae" (Given at Rome)
• "Benedictus XVI" (Pope Benedict XVI - papal signature)`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What does "Ad maiorem Dei gloriam" mean?',
            options: ['For the greater glory of God', 'Pray and work', 'In this sign you will conquer', 'Behold the man'],
            correctAnswer: 0,
            explanation: '"Ad maiorem Dei gloriam" is the Jesuit motto meaning "For the greater glory of God."'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'The Benedictine motto "Ora et _____" means "Pray and work".',
            correctAnswer: 'labora',
            explanation: '"Ora et labora" is the famous Benedictine motto emphasizing both prayer and work.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'Latin is still the official language of the Vatican.',
            correctAnswer: true,
            explanation: 'Yes! Latin remains the official language of the Vatican and is used in official Church documents.'
          }
        ],
        completed: false
      },
      {
        id: 12,
        title: 'Review and Practical Application',
        content: `How to continue studying Latin:

1. Practice pronunciation daily:
   • Read Latin prayers aloud
   • Listen to recordings of Gregorian chant
   • Practice with a Latin-English dictionary

2. Learn new vocabulary:
   • Focus on liturgical and prayer vocabulary
   • Study common phrases from the Mass
   • Memorize key prayers in Latin

3. Study grammar gradually:
   • Start with basic noun and verb forms
   • Learn one declension at a time
   • Practice with simple sentences

4. Use Latin in context:
   • Attend Latin Mass if available
   • Join a Latin study group
   • Read Latin prayers in your daily devotions

Resources for Catholic Latin study:

Books:
• "A Primer of Ecclesiastical Latin" by John F. Collins
• "Latin Grammar" by Cora and Charles Scanlon
• "The New Missal Latin" by Rev. H. P. G. Nunn

Online resources:
• Vatican website (vatican.va) - Official documents in Latin
• Gregorian chant recordings and tutorials
• Latin prayer apps and websites
• Online Latin dictionaries

Encouragement: using Latin in prayer, choir, and liturgy:

In prayer:
• Pray the Rosary in Latin
• Learn the Our Father and Hail Mary in Latin
• Use Latin prayers in your personal devotions
• Memorize favorite Latin phrases

In choir:
• Learn to sing Gregorian chant
• Participate in Latin Mass settings
• Study the meaning of the texts you sing
• Appreciate the beauty of sacred music

In liturgy:
• Understand the Latin responses in Mass
• Appreciate the universality of the Church
• Connect with centuries of Catholic tradition
• Deepen your participation in the liturgy

Final thoughts:

Latin is not a dead language for Catholics - it's a living tradition that:
• Connects us to our faith heritage
• Unites us with Catholics worldwide
• Enhances our understanding of the liturgy
• Deepens our prayer life
• Opens up the treasures of Church documents and theology

Keep practicing, stay patient, and enjoy the journey of learning this beautiful language of the Church!`,
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: 'What is a good way to continue studying Latin?',
            options: ['Only read about it', 'Practice pronunciation daily', 'Avoid using it', 'Learn everything at once'],
            correctAnswer: 1,
            explanation: 'Practicing pronunciation daily, reading Latin prayers aloud, and using Latin in context are excellent ways to continue learning.'
          },
          {
            id: 2,
            type: 'fill-blank',
            question: 'Latin is not a dead language for Catholics - it\'s a living _____ that connects us to our faith heritage.',
            correctAnswer: 'tradition',
            explanation: 'Latin is a living tradition that connects Catholics to centuries of faith, liturgy, and theology.'
          },
          {
            id: 3,
            type: 'true-false',
            question: 'You can use Latin in prayer, choir, and liturgy to deepen your faith experience.',
            correctAnswer: true,
            explanation: 'Yes! Using Latin in prayer, learning Gregorian chant, and understanding the liturgy in Latin can greatly enrich your Catholic faith.'
          }
        ],
        completed: false
      }
    ];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private certificateService: CertificateService,
    private scoreboardService: ScoreboardService,
    private alertController: AlertController
  ) {}

  goBack() {
    this.router.navigate(['/courses']);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = +params['id'] || 1;
      this.loadLessons();
      this.loadProgress();
      this.initializeLesson();
    });
  }

  loadLessons() {
    // Get course title from courses list
    const courses: { id: number; title: string }[] = [
      { id: 1, title: 'Introduction to the Catholic Faith' },
      { id: 2, title: 'Understanding the Holy Mass' },
      { id: 3, title: 'The Sacraments: Channels of God\'s Grace' },
      { id: 4, title: 'The Bible and How Catholics Read It' },
      { id: 5, title: 'The Creed: What Catholics Believe' },
      { id: 6, title: 'The Life and Teachings of Jesus Christ' },
      { id: 7, title: 'Foundations of Christian Prayer' },
      { id: 8, title: 'The Ten Commandments and Moral Living' },
      { id: 9, title: 'The Holy Trinity Explained' },
      { id: 10, title: 'Who Is the Blessed Virgin Mary?' },
      { id: 11, title: 'The Church: One, Holy, Catholic, and Apostolic' },
      { id: 12, title: 'The Saints and the Communion of Saints' },
      { id: 31, title: 'Latin for Catholics' },
      { id: 32, title: 'Salvation History: From Creation to Christ' },
      { id: 33, title: 'The Old Testament: Covenant and Prophecy' },
      { id: 34, title: 'The New Testament: Gospels and Apostolic Teaching' },
      { id: 35, title: 'Catholic Moral Theology: Conscience and Human Freedom' },
      { id: 36, title: 'Theology of the Body: Human Sexuality and Identity' },
      { id: 37, title: 'Catholic Teachings on Life Issues (Pro-life Formation)' },
      { id: 38, title: 'Introduction to Ignatian Spirituality' },
      { id: 39, title: 'Introduction to Carmelite Spirituality' },
      { id: 40, title: 'How to Make a Good Confession & Spiritual Examination' },
      { id: 41, title: 'Understanding the Sacramentals and Catholic Devotions' },
      { id: 42, title: 'Introduction to Gregorian Chant and Sacred Music' },
      { id: 43, title: 'Stewardship: Time, Talent, and Treasure' },
      { id: 44, title: 'Catholic Leadership and Ministry Training' },
      { id: 45, title: 'Catholic Teaching on Social Media & Modern Technology' },
      { id: 46, title: 'Interreligious Dialogue and Ecumenism' },
      { id: 47, title: 'The Church and Modern Culture' },
      { id: 48, title: 'Parish Life 101: Roles, Ministries, and How the Church Works' },
      { id: 49, title: 'Youth Catholic Formation: Faith for Young Catholics' }
    ];

    const course = courses.find(c => c.id === this.courseId);
    this.courseTitle = course?.title || 'Course';

    if (this.courseId === 1) {
      this.lessons = this.getCourse1Lessons();
      this.hasContent = true;
    } else if (this.courseId === 2) {
      this.lessons = this.getCourse2Lessons();
      this.hasContent = true;
    } else if (this.courseId === 3) {
      this.lessons = this.getCourse3Lessons();
      this.hasContent = true;
    } else if (this.courseId === 4) {
      this.lessons = this.getCourse4Lessons();
      this.hasContent = true;
    } else if (this.courseId === 31) {
      this.lessons = this.getCourse31Lessons();
      this.hasContent = true;
    } else {
      // Course doesn't have content yet
      this.lessons = [];
      this.hasContent = false;
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

