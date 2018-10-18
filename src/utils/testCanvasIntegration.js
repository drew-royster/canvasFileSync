/* eslint-disable */
const canvasIntegration = require('./canvasIntegration');
console.log(canvasIntegration);
const fs = require('fs');

const networks = {
  "id": 458739,
  "sync": true,
  "path": "/Users/drewroyster/Documents/classes/Networks 3",
  "name": "Networks 3",
  "items": [
    {
      "name": "Course Info",
      "folder": true,
      "lastUpdated": "2018-08-10T04:51:08Z",
      "folders_count": 0,
      "folders_url": "https://uvu.instructure.com/api/v1/folders/3401036/folders",
      "files_count": 4,
      "files_url": "https://uvu.instructure.com/api/v1/folders/3401036/files",
      "size": 0,
      "sync": true,
      "id": 3401036,
      "items": [
        {
          "name": "CS 4610 Schedule Fall 18 v2.pdf",
          "url": "https://uvu.instructure.com/files/89217962/download?download_frd=1&verifier=efiXEznlx1OOq5VAZi65sNLRRDdKfg9yyq8dcPZ2",
          "folder": false,
          "lastUpdated": "2018-09-02T18:51:40Z",
          "size": 25573,
          "sync": true,
          "id": 89217962
        },
        {
          "name": "CS 4610 Syllabus Fall 18 v1.pdf",
          "url": "https://uvu.instructure.com/files/88635123/download?download_frd=1&verifier=MEouwpwDxdn39k9mGWVTAjtjDyiHpdit3ouKbMKu",
          "folder": false,
          "lastUpdated": "2018-08-21T22:12:55Z",
          "size": 337974,
          "sync": true,
          "id": 88635123
        },
        {
          "name": "Notes on Programmer's Calculators.docx",
          "url": "https://uvu.instructure.com/files/88592295/download?download_frd=1&verifier=nkjGmiuGX4HBr8Zuo6EhLuIUr1QpvQsE6ek1qWAs",
          "folder": false,
          "lastUpdated": "2018-08-21T17:59:15Z",
          "size": 14035,
          "sync": true,
          "id": 88592295
        },
        {
          "name": "TheSecretOfLife.txt",
          "url": "https://uvu.instructure.com/files/88967281/download?download_frd=1&verifier=Th3a1qSI6fOs1EccZNbt2mNJ4x18fGKVDsArkVtt",
          "folder": false,
          "lastUpdated": "2018-08-27T19:27:02Z",
          "size": 37,
          "sync": true,
          "id": 88967281
        }
      ]
    },
    {
      "name": "Homework Assignments",
      "folder": true,
      "lastUpdated": "2018-08-10T04:51:09Z",
      "folders_count": 0,
      "folders_url": "https://uvu.instructure.com/api/v1/folders/3401037/folders",
      "files_count": 6,
      "files_url": "https://uvu.instructure.com/api/v1/folders/3401037/files",
      "size": 0,
      "sync": true,
      "id": 3401037,
      "items": [
        {
          "name": "Fragmentation Exercise Solution.docx",
          "url": "https://uvu.instructure.com/files/89290418/download?download_frd=1&verifier=gIo0ISZHIf4mEHFTu2hyKp52Azs024ilo8FNrvO6",
          "folder": false,
          "lastUpdated": "2018-09-10T22:31:44Z",
          "size": 157065,
          "sync": true,
          "id": 89290418
        },
        {
          "name": "Fragmentation Exercise.docx",
          "url": "https://uvu.instructure.com/files/89077025/download?download_frd=1&verifier=xPoL8eJLYzrg9hgHwaQ26hICC8e88WJoisPUas2A",
          "folder": false,
          "lastUpdated": "2018-08-27T17:34:02Z",
          "size": 14162,
          "sync": true,
          "id": 89077025
        },
        {
          "name": "IP_Address_Exercise.docx",
          "url": "https://uvu.instructure.com/files/89024023/download?download_frd=1&verifier=cJPA6TeGAn62YsaPBonnLnfGfPCTVyFj9cjqNdEE",
          "folder": false,
          "lastUpdated": "2018-08-23T23:44:10Z",
          "size": 14037,
          "sync": true,
          "id": 89024023
        },
        {
          "name": "Sub & Supernet Exercise Solution.docx",
          "url": "https://uvu.instructure.com/files/89565504/download?download_frd=1&verifier=fhRUbELExruFZIDGLZo2gadOQkWrp5BCHvmOR8bb",
          "folder": false,
          "lastUpdated": "2018-09-24T05:12:50Z",
          "size": 41036,
          "sync": true,
          "id": 89565504
        },
        {
          "name": "Sub & Supernet Exercise.docx",
          "url": "https://uvu.instructure.com/files/89439830/download?download_frd=1&verifier=u23HrF3rahie0C5DVPasAo9hWitvrcDkqvTCf9X4",
          "folder": false,
          "lastUpdated": "2018-09-13T23:08:59Z",
          "size": 20458,
          "sync": true,
          "id": 89439830
        },
        {
          "name": "TraceRoute Exercise.docx",
          "url": "https://uvu.instructure.com/files/89414184/download?download_frd=1&verifier=uwplbbbc40QVQ0U08fZTQBP2n8UukONKvaQQNVcY",
          "folder": false,
          "lastUpdated": "2018-09-11T21:27:55Z",
          "size": 18536,
          "sync": true,
          "id": 89414184
        }
      ]
    },
    {
      "name": "Lab Exercises",
      "folder": true,
      "lastUpdated": "2018-08-10T04:51:07Z",
      "folders_count": 1,
      "folders_url": "https://uvu.instructure.com/api/v1/folders/3401031/folders",
      "files_count": 6,
      "files_url": "https://uvu.instructure.com/api/v1/folders/3401031/files",
      "size": 0,
      "sync": true,
      "id": 3401031,
      "items": [
        {
          "name": "Software",
          "folder": true,
          "lastUpdated": "2018-08-10T04:51:07Z",
          "folders_count": 2,
          "folders_url": "https://uvu.instructure.com/api/v1/folders/3401032/folders",
          "files_count": 0,
          "files_url": "https://uvu.instructure.com/api/v1/folders/3401032/files",
          "size": 0,
          "sync": true,
          "id": 3401032,
          "items": [
            {
              "name": "MikroTik",
              "folder": true,
              "lastUpdated": "2018-08-10T04:51:11Z",
              "folders_count": 2,
              "folders_url": "https://uvu.instructure.com/api/v1/folders/3401038/folders",
              "files_count": 0,
              "files_url": "https://uvu.instructure.com/api/v1/folders/3401038/files",
              "size": 0,
              "sync": true,
              "id": 3401038,
              "items": [
                {
                  "name": "Old Winbox",
                  "folder": true,
                  "lastUpdated": "2018-08-12T22:14:34Z",
                  "folders_count": 1,
                  "folders_url": "https://uvu.instructure.com/api/v1/folders/3401951/folders",
                  "files_count": 0,
                  "files_url": "https://uvu.instructure.com/api/v1/folders/3401951/files",
                  "size": 0,
                  "sync": true,
                  "id": 3401951,
                  "items": [
                    {
                      "name": "Winbox v2.2",
                      "folder": true,
                      "lastUpdated": "2018-08-12T22:14:34Z",
                      "folders_count": 0,
                      "folders_url": "https://uvu.instructure.com/api/v1/folders/3401952/folders",
                      "files_count": 2,
                      "files_url": "https://uvu.instructure.com/api/v1/folders/3401952/files",
                      "size": 0,
                      "sync": true,
                      "id": 3401952,
                      "items": [
                        {
                          "name": "MikrotikWinbox.dmg",
                          "url": "https://uvu.instructure.com/files/88592328/download?download_frd=1&verifier=Xq3omGrP7Xr72BN1ltTBlBQPxq1lGGAzKqHWVMJk",
                          "folder": false,
                          "lastUpdated": "2018-08-12T22:08:05Z",
                          "size": 158529637,
                          "sync": true,
                          "id": 88592328
                        },
                        {
                          "name": "winbox.exe",
                          "url": "https://uvu.instructure.com/files/88636332/download?download_frd=1&verifier=x0ZzjQ4dQpnrJWsWsy6psMTV7pPkFftl2befNK5M",
                          "folder": false,
                          "lastUpdated": "2018-08-12T22:06:02Z",
                          "size": 114176,
                          "sync": true,
                          "id": 88636332
                        }
                      ]
                    }
                  ]
                },
                {
                  "name": "Winbox v3.17",
                  "folder": true,
                  "lastUpdated": "2018-08-12T22:04:38Z",
                  "folders_count": 0,
                  "folders_url": "https://uvu.instructure.com/api/v1/folders/3401950/folders",
                  "files_count": 1,
                  "files_url": "https://uvu.instructure.com/api/v1/folders/3401950/files",
                  "size": 0,
                  "sync": true,
                  "id": 3401950,
                  "items": [
                    {
                      "name": "winbox.exe",
                      "url": "https://uvu.instructure.com/files/88636354/download?download_frd=1&verifier=saFZICOIJyhESfFSr4HHQzblT9jhWH4jqZWfPy8g",
                      "folder": false,
                      "lastUpdated": "2018-08-12T22:12:53Z",
                      "size": 1660472,
                      "sync": true,
                      "id": 88636354
                    }
                  ]
                }
              ]
            },
            {
              "name": "SNMP",
              "folder": true,
              "lastUpdated": "2018-08-10T04:51:07Z",
              "folders_count": 1,
              "folders_url": "https://uvu.instructure.com/api/v1/folders/3401033/folders",
              "files_count": 0,
              "files_url": "https://uvu.instructure.com/api/v1/folders/3401033/files",
              "size": 0,
              "sync": true,
              "id": 3401033,
              "items": [
                {
                  "name": "iReasoning",
                  "folder": true,
                  "lastUpdated": "2018-08-10T04:51:07Z",
                  "folders_count": 0,
                  "folders_url": "https://uvu.instructure.com/api/v1/folders/3401034/folders",
                  "files_count": 2,
                  "files_url": "https://uvu.instructure.com/api/v1/folders/3401034/files",
                  "size": 0,
                  "sync": true,
                  "id": 3401034,
                  "items": [
                    {
                      "name": "mibbrowser.zip",
                      "url": "https://uvu.instructure.com/files/88592278/download?download_frd=1&verifier=BSkuoZTQ7j4YJYG7VrkqsXOvLM8d7L3TYlwiFiZX",
                      "folder": false,
                      "lastUpdated": "2018-08-10T04:51:07Z",
                      "size": 8782620,
                      "sync": true,
                      "id": 88592278
                    },
                    {
                      "name": "setup.exe",
                      "url": "https://uvu.instructure.com/files/88592284/download?download_frd=1&verifier=lsiEjO25X71rFYSnGi3bIKPixU8OHQPhKyG5gsTL",
                      "folder": false,
                      "lastUpdated": "2018-08-10T04:51:08Z",
                      "size": 14872495,
                      "sync": true,
                      "id": 88592284
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name": "iptables Reference.pdf",
          "url": "https://uvu.instructure.com/files/88592304/download?download_frd=1&verifier=qFCrt77BXvkuJaGQRnD5M9ZWZfgR9gCo2GYk7ejz",
          "folder": false,
          "lastUpdated": "2018-08-27T19:28:45Z",
          "size": 208978,
          "sync": true,
          "id": 88592304
        },
        {
          "name": "Lab 1 - MikroTik RouterOS Introduction and Basic Configuration.pdf",
          "url": "https://uvu.instructure.com/files/88997153/download?download_frd=1&verifier=IpknwT30kK13Dr8rhAK8zYEDliCVPkZ0umCvM3iC",
          "folder": false,
          "lastUpdated": "2018-08-24T20:47:58Z",
          "size": 773430,
          "sync": true,
          "id": 88997153
        },
        {
          "name": "Lab 2 - Configuring a Stateless RouterOS Firewall.pdf",
          "url": "https://uvu.instructure.com/files/89296551/download?download_frd=1&verifier=9Xkxr6HcU21gb9PiKDpY5xEA15o8p8LzyggA2AUM",
          "folder": false,
          "lastUpdated": "2018-09-06T21:42:05Z",
          "size": 888681,
          "sync": true,
          "id": 89296551
        },
        {
          "name": "Lab 3 - Configuring a Stateful RouterOS Firewall.pdf",
          "url": "https://uvu.instructure.com/files/89480540/download?download_frd=1&verifier=DjgNmn4nUZNQxTLTVf4GzCZt7F0CdxiMZ2fOPVvu",
          "folder": false,
          "lastUpdated": "2018-09-22T17:03:34Z",
          "size": 576591,
          "sync": true,
          "id": 89480540
        },
        {
          "name": "Lab 4 - Routing with RIP - Part 1.pdf",
          "url": "https://uvu.instructure.com/files/89689558/download?download_frd=1&verifier=ZNjRIBUKqwUidj7e0iVVBP3IOIocsf3cjxlnGLNi",
          "folder": false,
          "lastUpdated": "2018-10-08T20:15:32Z",
          "size": 686110,
          "sync": true,
          "id": 89689558
        },
        {
          "name": "Lab 6.pcap",
          "url": "https://uvu.instructure.com/files/88592289/download?download_frd=1&verifier=lNfEGd3EISWwxT4PBblkbw5tyGegWFqPKzYkv6o1",
          "folder": false,
          "lastUpdated": "2018-08-10T04:51:08Z",
          "size": 40016,
          "sync": true,
          "id": 88592289
        }
      ]
    },
    {
      "name": "Lecture Notes",
      "folder": true,
      "lastUpdated": "2018-08-10T04:51:06Z",
      "folders_count": 0,
      "folders_url": "https://uvu.instructure.com/api/v1/folders/3401024/folders",
      "files_count": 12,
      "files_url": "https://uvu.instructure.com/api/v1/folders/3401024/files",
      "size": 0,
      "sync": true,
      "id": 3401024,
      "items": [
        {
          "name": "Ch 1 Lecture.docx",
          "url": "https://uvu.instructure.com/files/89185392/download?download_frd=1&verifier=bX4EU2g7zH9tuj5eblYEehL7OOPte7imAELitsny",
          "folder": false,
          "lastUpdated": "2018-08-31T19:07:47Z",
          "size": 34168,
          "sync": true,
          "id": 89185392
        },
        {
          "name": "Ch 2 Lecture.docx",
          "url": "https://uvu.instructure.com/files/89185393/download?download_frd=1&verifier=IGEbpRdfAbI8ATeshm5k3MsKREya9Y9kiZaYsT7p",
          "folder": false,
          "lastUpdated": "2018-09-06T22:18:46Z",
          "size": 25539,
          "sync": true,
          "id": 89185393
        },
        {
          "name": "Ch 4 Lecture.docx",
          "url": "https://uvu.instructure.com/files/89185394/download?download_frd=1&verifier=433bgQxPfHbN1SH7ZyYQ4hPAho3gfv0JT8yHraGk",
          "folder": false,
          "lastUpdated": "2018-09-04T19:34:56Z",
          "size": 37928,
          "sync": true,
          "id": 89185394
        },
        {
          "name": "Ch 5 Lecture.docx",
          "url": "https://uvu.instructure.com/files/89185395/download?download_frd=1&verifier=BhR3DTVGoYhMfpHXZbL0AutatZftBj36Os1D1o6s",
          "folder": false,
          "lastUpdated": "2018-09-04T14:48:59Z",
          "size": 33498,
          "sync": true,
          "id": 89185395
        },
        {
          "name": "Ch 6 Lecture.docx",
          "url": "https://uvu.instructure.com/files/89185396/download?download_frd=1&verifier=NBDSZQbboEfyhjtwwsCb6USRV9hrhE5YqIR7Q54E",
          "folder": false,
          "lastUpdated": "2018-09-04T19:37:02Z",
          "size": 30124,
          "sync": true,
          "id": 89185396
        },
        {
          "name": "Ch 7 Lecture.docx",
          "url": "https://uvu.instructure.com/files/89268873/download?download_frd=1&verifier=R4CpzFYiGtTgMA3Xsyz6dhLH8d3FrWKRlFwLqkBN",
          "folder": false,
          "lastUpdated": "2018-09-04T21:42:55Z",
          "size": 29079,
          "sync": true,
          "id": 89268873
        },
        {
          "name": "Ch 8 Lecture.docx",
          "url": "https://uvu.instructure.com/files/89324539/download?download_frd=1&verifier=3gRyTSPpxrJ0cnyHXxetSGGo3gLSQKgNh902nGS0",
          "folder": false,
          "lastUpdated": "2018-09-11T20:01:58Z",
          "size": 31635,
          "sync": true,
          "id": 89324539
        },
        {
          "name": "Ch 9 Lecture.docx",
          "url": "https://uvu.instructure.com/files/89463377/download?download_frd=1&verifier=l2bZvcsas8UWLcis6Sh8UlG8gv5Rh2gK59iCQsO2",
          "folder": false,
          "lastUpdated": "2018-09-14T18:34:32Z",
          "size": 66528,
          "sync": true,
          "id": 89463377
        },
        {
          "name": "Ch 11 Lecture.docx",
          "url": "https://uvu.instructure.com/files/89541215/download?download_frd=1&verifier=YcwBRQVuXbzAnyBhHsWWblhDjZvsTXZqLVLhb7oG",
          "folder": false,
          "lastUpdated": "2018-09-20T22:01:28Z",
          "size": 28827,
          "sync": true,
          "id": 89541215
        },
        {
          "name": "Ch 12 Lecture.docx",
          "url": "https://uvu.instructure.com/files/89630103/download?download_frd=1&verifier=k7u0XJzBFqP4Mnm1EkjUQlvjMO520PvhbJ0WUjy0",
          "folder": false,
          "lastUpdated": "2018-10-01T23:24:21Z",
          "size": 84667,
          "sync": true,
          "id": 89630103
        },
        {
          "name": "Ch 13 Lecture.docx",
          "url": "https://uvu.instructure.com/files/89712849/download?download_frd=1&verifier=DQF6WQRNXpFMijzUgZt3Oof8NsUfzHWDxCWBpIFa",
          "folder": false,
          "lastUpdated": "2018-10-05T04:09:10Z",
          "size": 34339,
          "sync": true,
          "id": 89712849
        },
        {
          "name": "Ch 30 Lecture.docx",
          "url": "https://uvu.instructure.com/files/89350328/download?download_frd=1&verifier=8pMIQWZHFyL6ygKjhxhZpjVCIncAJquuZI1QotOH",
          "folder": false,
          "lastUpdated": "2018-09-11T00:50:18Z",
          "size": 34242,
          "sync": true,
          "id": 89350328
        }
      ]
    },
    {
      "name": "PowerPoint Slides",
      "folder": true,
      "lastUpdated": "2018-08-10T04:51:06Z",
      "folders_count": 0,
      "folders_url": "https://uvu.instructure.com/api/v1/folders/3401025/folders",
      "files_count": 19,
      "files_url": "https://uvu.instructure.com/api/v1/folders/3401025/files",
      "size": 0,
      "sync": true,
      "id": 3401025,
      "items": [
        {
          "name": "Ch 1 - Introduction & Overview.pptx",
          "url": "https://uvu.instructure.com/files/88920805/download?download_frd=1&verifier=To5qGFKI6ZKJ8VaFZ8PtOpCBdmBNu8h6pMVc8xr8",
          "folder": false,
          "lastUpdated": "2018-08-21T22:07:29Z",
          "size": 612792,
          "sync": true,
          "id": 88920805
        },
        {
          "name": "Ch 2 - Review of Underlying Network Technologies.pptx",
          "url": "https://uvu.instructure.com/files/88920807/download?download_frd=1&verifier=1OKDRbgNbvwf2kE3A4NJ1AwuAEsegb7eA85Bei35",
          "folder": false,
          "lastUpdated": "2018-08-21T23:08:09Z",
          "size": 174454,
          "sync": true,
          "id": 88920807
        },
        {
          "name": "Ch 4 - Classful Internet Addresses.pptx",
          "url": "https://uvu.instructure.com/files/88920813/download?download_frd=1&verifier=offEsC6207Dx2Ncu67syusKeU6xH8Z9AbQ1xcwUd",
          "folder": false,
          "lastUpdated": "2018-08-21T16:37:43Z",
          "size": 368350,
          "sync": true,
          "id": 88920813
        },
        {
          "name": "Ch 5 - Mapping Internet Addresses to Physical Addresses.pptx",
          "url": "https://uvu.instructure.com/files/89003790/download?download_frd=1&verifier=eIrqKf3WXGKrdeEBCpTt8oXouN9wV1RzZY2T3NMB",
          "folder": false,
          "lastUpdated": "2018-08-23T22:39:05Z",
          "size": 282335,
          "sync": true,
          "id": 89003790
        },
        {
          "name": "Ch 6 - IP Connectionless Datagram Delivery.pptx",
          "url": "https://uvu.instructure.com/files/89077101/download?download_frd=1&verifier=qUi7sDvsiM9ZvUQDniR8QEoHOeeovPyr6e8jU9i2",
          "folder": false,
          "lastUpdated": "2018-08-28T15:28:13Z",
          "size": 3428303,
          "sync": true,
          "id": 89077101
        },
        {
          "name": "Ch 7 - IP Forwarding IP Datagrams.pptx",
          "url": "https://uvu.instructure.com/files/88592333/download?download_frd=1&verifier=4xP8o06kV3uIBKYDZ8zw1LIHKOJIi1kvzlDRlyIg",
          "folder": false,
          "lastUpdated": "2018-08-30T00:44:33Z",
          "size": 1308198,
          "sync": true,
          "id": 88592333
        },
        {
          "name": "Ch 8 - Error and Control Messages.pptx",
          "url": "https://uvu.instructure.com/files/88592302/download?download_frd=1&verifier=jJ56snyYOVBjJEtD972VmNCJmVhek4FM3AcS8N2K",
          "folder": false,
          "lastUpdated": "2018-08-30T22:58:44Z",
          "size": 445644,
          "sync": true,
          "id": 88592302
        },
        {
          "name": "Ch 9 - Classless and Subnet Address Extensions.pptx",
          "url": "https://uvu.instructure.com/files/89444042/download?download_frd=1&verifier=aFOebq97cfBVWW90Y1RIuUwzIMNsUkj0WhCJ5u2b",
          "folder": false,
          "lastUpdated": "2018-09-13T19:05:13Z",
          "size": 5119504,
          "sync": true,
          "id": 89444042
        },
        {
          "name": "Ch 11 - User Datagram Protocol (UDP).pptx",
          "url": "https://uvu.instructure.com/files/89441244/download?download_frd=1&verifier=xmebE5BhNHCqrEeex01bhFlAUb4NI4qL1VPawkRy",
          "folder": false,
          "lastUpdated": "2018-09-18T22:08:43Z",
          "size": 2606170,
          "sync": true,
          "id": 89441244
        },
        {
          "name": "Ch 12 - Reliable Stream Transport Service (TCP).pptx",
          "url": "https://uvu.instructure.com/files/89504069/download?download_frd=1&verifier=YKoNQpvETHnGtTYrHJrDSb91IGzXkbRIJGpvsbi1",
          "folder": false,
          "lastUpdated": "2018-09-18T22:33:39Z",
          "size": 4134760,
          "sync": true,
          "id": 89504069
        },
        {
          "name": "Ch 13 - Routing Architecture.pptx",
          "url": "https://uvu.instructure.com/files/89657702/download?download_frd=1&verifier=8Ivuk1uvkuN8hzAvxkbgoTR2yN1veuCEuy7Ko5JJ",
          "folder": false,
          "lastUpdated": "2018-10-02T22:36:16Z",
          "size": 238614,
          "sync": true,
          "id": 89657702
        },
        {
          "name": "Ch 14 - Routing Between Peers (BGP).pptx",
          "url": "https://uvu.instructure.com/files/88592272/download?download_frd=1&verifier=y16Rjg55heGWS67QCjrN5ChLX7HX3iBPq3Axc6Cd",
          "folder": false,
          "lastUpdated": "2018-10-04T22:42:31Z",
          "size": 4856588,
          "sync": true,
          "id": 88592272
        },
        {
          "name": "Ch 15 - Routing Within an Autonomous Systems (RIP, OSFP).pptx",
          "url": "https://uvu.instructure.com/files/89755406/download?download_frd=1&verifier=1wJasRZXptfgXt3aDtidHXUxVkWWGvEsXDEdRQi0",
          "folder": false,
          "lastUpdated": "2018-10-09T22:06:04Z",
          "size": 11957689,
          "sync": true,
          "id": 89755406
        },
        {
          "name": "Ch 16 - Internet Multicasting.pptx",
          "url": "https://uvu.instructure.com/files/88592332/download?download_frd=1&verifier=w4jc5QYaD1HUFgJG85hOzCL8sRKyTNKm4hEJ1Sat",
          "folder": false,
          "lastUpdated": "2018-09-14T18:23:46Z",
          "size": 1492413,
          "sync": true,
          "id": 88592332
        },
        {
          "name": "Ch 23 - The Domain Name System (DNS).pptx",
          "url": "https://uvu.instructure.com/files/88592273/download?download_frd=1&verifier=tMoAAWrtN5NzHZQ9uWaPotu538XZDp0Iw5Vnaqv9",
          "folder": false,
          "lastUpdated": "2018-09-13T19:10:34Z",
          "size": 3565851,
          "sync": true,
          "id": 88592273
        },
        {
          "name": "Ch 28 - Voice and Video Over IP.pptx",
          "url": "https://uvu.instructure.com/files/88592349/download?download_frd=1&verifier=jQ7wDfhSryVPdNk13Ti32vRZkDeLPUzYvQ6kG2Ld",
          "folder": false,
          "lastUpdated": "2018-09-13T19:10:33Z",
          "size": 1143707,
          "sync": true,
          "id": 88592349
        },
        {
          "name": "Ch 29 - Network Management (SNMP).pptx",
          "url": "https://uvu.instructure.com/files/88592343/download?download_frd=1&verifier=4jtJhQSf7C0i2LiUKCOG9IEhV7o16lAekU0UM4q5",
          "folder": false,
          "lastUpdated": "2018-09-11T21:49:16Z",
          "size": 7295192,
          "sync": true,
          "id": 88592343
        },
        {
          "name": "Ch 30 - Internet Security and Firewall Design.pptx",
          "url": "https://uvu.instructure.com/files/89268866/download?download_frd=1&verifier=3Lf5zWXhk7eC2VeyETQ8IW3joqcwBAPSjUcuu2KL",
          "folder": false,
          "lastUpdated": "2018-09-04T23:05:05Z",
          "size": 298406,
          "sync": true,
          "id": 89268866
        },
        {
          "name": "Ch 31 - A Next Generation IP (IPv6).pptx",
          "url": "https://uvu.instructure.com/files/88592341/download?download_frd=1&verifier=dLLZdIbCzyZluI1A6tDMXCs2H0spibTtJMLA6lmw",
          "folder": false,
          "lastUpdated": "2018-08-10T04:51:12Z",
          "size": 1174522,
          "sync": true,
          "id": 88592341
        }
      ]
    },
    {
      "name": "Reading Assignments & Tutorials",
      "folder": true,
      "lastUpdated": "2018-08-10T04:51:07Z",
      "folders_count": 0,
      "folders_url": "https://uvu.instructure.com/api/v1/folders/3401027/folders",
      "files_count": 11,
      "files_url": "https://uvu.instructure.com/api/v1/folders/3401027/files",
      "size": 0,
      "sync": true,
      "id": 3401027,
      "items": [
        {
          "name": "3Com_CIDR.html",
          "url": "https://uvu.instructure.com/files/88592279/download?download_frd=1&verifier=28gLkq6ZxFbfzfeZcXcZeFWkj8q0Bl2D09Ns4u58",
          "folder": false,
          "lastUpdated": "2018-08-10T04:51:07Z",
          "size": 136294,
          "sync": true,
          "id": 88592279
        },
        {
          "name": "ACC_CIDR.html",
          "url": "https://uvu.instructure.com/files/88592275/download?download_frd=1&verifier=uZjAUGM7SHF6GAqXTLeRp8xLq7xOtkvSR7PFAwlm",
          "folder": false,
          "lastUpdated": "2018-08-10T04:51:07Z",
          "size": 24494,
          "sync": true,
          "id": 88592275
        },
        {
          "name": "Bradner IETF article.pdf",
          "url": "https://uvu.instructure.com/files/88592290/download?download_frd=1&verifier=hYOVFD5IphzAl8mJZgDrDu4rjObisUHpsFhseRoP",
          "folder": false,
          "lastUpdated": "2018-08-21T16:41:17Z",
          "size": 61484,
          "sync": true,
          "id": 88592290
        },
        {
          "name": "DataComm_CIDR.html",
          "url": "https://uvu.instructure.com/files/88592288/download?download_frd=1&verifier=TcaYGUPu5WaMLSHlvYGmmKEW5LlHpW48UwBAw2IP",
          "folder": false,
          "lastUpdated": "2018-08-10T04:51:08Z",
          "size": 23831,
          "sync": true,
          "id": 88592288
        },
        {
          "name": "DHCP.pdf",
          "url": "https://uvu.instructure.com/files/88592282/download?download_frd=1&verifier=LtBmpVNMlr8uuWcXUxFGTLqYVbXZosHPjWks1GIS",
          "folder": false,
          "lastUpdated": "2018-08-10T04:51:08Z",
          "size": 54762,
          "sync": true,
          "id": 88592282
        },
        {
          "name": "Ethernet Frame Types Tutorial.pdf",
          "url": "https://uvu.instructure.com/files/88592286/download?download_frd=1&verifier=onud6ZZSf5oF23u4LhkI2aELtUF5PGiLloqBCpPK",
          "folder": false,
          "lastUpdated": "2018-08-21T17:04:15Z",
          "size": 148957,
          "sync": true,
          "id": 88592286
        },
        {
          "name": "Flow Transparent Mobility for IPv6.pdf",
          "url": "https://uvu.instructure.com/files/88592283/download?download_frd=1&verifier=OFdhJu3IaLKe0gVcDfHFm6fQuxCcW2cFcik0JVsJ",
          "folder": false,
          "lastUpdated": "2018-08-10T04:51:08Z",
          "size": 249505,
          "sync": true,
          "id": 88592283
        },
        {
          "name": "IBM_CIDR.html",
          "url": "https://uvu.instructure.com/files/88592276/download?download_frd=1&verifier=TuwL2VFAGVsIb4jb5olOBQJUnIEnS6WpUQCfkc07",
          "folder": false,
          "lastUpdated": "2018-08-10T04:51:07Z",
          "size": 33269,
          "sync": true,
          "id": 88592276
        },
        {
          "name": "NIST Cloud Computing Synopsis.pdf",
          "url": "https://uvu.instructure.com/files/88592327/download?download_frd=1&verifier=mbEriy4ZkmFjUdU2juYApmj6vq4bFwHwv55qCmwp",
          "folder": false,
          "lastUpdated": "2018-08-10T04:51:10Z",
          "size": 1512026,
          "sync": true,
          "id": 88592327
        },
        {
          "name": "PacBell_CIDR.html",
          "url": "https://uvu.instructure.com/files/88592287/download?download_frd=1&verifier=r16JfaKnGBaAOmRmTLWN8V3duqFkmetFOQYRkuPy",
          "folder": false,
          "lastUpdated": "2018-08-10T04:51:08Z",
          "size": 13364,
          "sync": true,
          "id": 88592287
        },
        {
          "name": "TCP-RTM Using TCP for Real Time Multimedia Applications - Liang.pdf",
          "url": "https://uvu.instructure.com/files/88592285/download?download_frd=1&verifier=yO8VCKIaOE1kUc6s86ZN4H3djtID3E4qLycXqk5Q",
          "folder": false,
          "lastUpdated": "2018-08-10T04:51:08Z",
          "size": 1320915,
          "sync": true,
          "id": 88592285
        }
      ]
    },
    {
      "name": "Software",
      "folder": true,
      "lastUpdated": "2018-08-10T04:51:07Z",
      "folders_count": 2,
      "folders_url": "https://uvu.instructure.com/api/v1/folders/3401028/folders",
      "files_count": 0,
      "files_url": "https://uvu.instructure.com/api/v1/folders/3401028/files",
      "size": 0,
      "sync": true,
      "id": 3401028,
      "items": [
        {
          "name": "QuickVLSM",
          "folder": true,
          "lastUpdated": "2018-08-10T04:51:07Z",
          "folders_count": 1,
          "folders_url": "https://uvu.instructure.com/api/v1/folders/3401029/folders",
          "files_count": 4,
          "files_url": "https://uvu.instructure.com/api/v1/folders/3401029/files",
          "size": 0,
          "sync": true,
          "id": 3401029,
          "items": [
            {
              "name": "Download",
              "folder": true,
              "lastUpdated": "2018-08-10T04:51:07Z",
              "folders_count": 0,
              "folders_url": "https://uvu.instructure.com/api/v1/folders/3401030/folders",
              "files_count": 1,
              "files_url": "https://uvu.instructure.com/api/v1/folders/3401030/files",
              "size": 0,
              "sync": true,
              "id": 3401030,
              "items": [
                {
                  "name": "quick-vlsm_v1.4.zip",
                  "url": "https://uvu.instructure.com/files/88592277/download?download_frd=1&verifier=uEHH73Sh0RhhmJCFgJxAdJ04RnsNTa8yAsBREU35",
                  "folder": false,
                  "lastUpdated": "2018-08-10T04:51:07Z",
                  "size": 63559,
                  "sync": true,
                  "id": 88592277
                }
              ]
            },
            {
              "name": "calculate.htm",
              "url": "https://uvu.instructure.com/files/88592323/download?download_frd=1&verifier=XCui97LelfNUYOV2X357Q8xTF4JA9gKvgMZRoOce",
              "folder": false,
              "lastUpdated": "2018-08-10T04:51:10Z",
              "size": 35913,
              "sync": true,
              "id": 88592323
            },
            {
              "name": "header.jpg",
              "url": "https://uvu.instructure.com/files/88592325/download?download_frd=1&verifier=Q9wKKTBIdCvUfEL4P8pIgQ5pis1MQIuEsl1p4Ybi",
              "folder": false,
              "lastUpdated": "2018-08-10T04:51:10Z",
              "size": 50420,
              "sync": true,
              "id": 88592325
            },
            {
              "name": "index.htm",
              "url": "https://uvu.instructure.com/files/88592324/download?download_frd=1&verifier=8CLcwAUTaqlbnOnRLNjiB44A3gqFj4aEgkTAEZ9P",
              "folder": false,
              "lastUpdated": "2018-08-10T04:51:10Z",
              "size": 11487,
              "sync": true,
              "id": 88592324
            },
            {
              "name": "README-v1.4.txt",
              "url": "https://uvu.instructure.com/files/88592326/download?download_frd=1&verifier=wxMU4fzFWyIjYAOywqmN0BS5iW1re6efAPQZk2bD",
              "folder": false,
              "lastUpdated": "2018-08-10T04:51:10Z",
              "size": 1472,
              "sync": true,
              "id": 88592326
            }
          ]
        },
        {
          "name": "Subnet Calculator",
          "folder": true,
          "lastUpdated": "2018-08-10T04:51:08Z",
          "folders_count": 0,
          "folders_url": "https://uvu.instructure.com/api/v1/folders/3401035/folders",
          "files_count": 1,
          "files_url": "https://uvu.instructure.com/api/v1/folders/3401035/files",
          "size": 0,
          "sync": true,
          "id": 3401035,
          "items": [
            {
              "name": "ipcalc11.zip",
              "url": "https://uvu.instructure.com/files/88592281/download?download_frd=1&verifier=lAuziIyC8Z2mxWTAyt5Vkpc4vW2sN3H3Qft1FCPA",
              "folder": false,
              "lastUpdated": "2018-08-10T04:51:08Z",
              "size": 238602,
              "sync": true,
              "id": 88592281
            }
          ]
        }
      ]
    },
    {
      "name": "Test Reviews",
      "folder": true,
      "lastUpdated": "2018-08-10T04:51:07Z",
      "folders_count": 0,
      "folders_url": "https://uvu.instructure.com/api/v1/folders/3401026/folders",
      "files_count": 1,
      "files_url": "https://uvu.instructure.com/api/v1/folders/3401026/files",
      "size": 0,
      "sync": true,
      "id": 3401026,
      "items": [
        {
          "name": "Test 1 Review.pdf",
          "url": "https://uvu.instructure.com/files/89324924/download?download_frd=1&verifier=9hiC99mVUrJwpJCSxSdPgmfWPzgqupkfDt8kcKKn",
          "folder": false,
          "lastUpdated": "2018-09-06T17:13:09Z",
          "size": 168893,
          "sync": true,
          "id": 89324924
        }
      ]
    }
  ],
  "files_url": "https://uvu.instructure.com/api/v1/folders/3279279/files",
  "folders_url": "https://uvu.instructure.com/api/v1/folders/3279279/folders"
};

const numerics = {
  "id": 462411,
  "sync": true,
  "path": "/Users/drewroyster/Documents/classes/Numerics",
  "name": "Numerics",
  "items": [
    {
      "name": "Bisection FP iteration 2018F.pdf",
      "url": "https://uvu.instructure.com/files/89190262/download?download_frd=1&verifier=T7xWBaQtq0k1C9MeKUrzcMELB55bHPGhbOtIdI8U",
      "folder": false,
      "lastUpdated": "2018-09-04T20:16:55Z",
      "size": 1764084,
      "sync": true,
      "id": 89190262
    },
    {
      "name": "Calc1Review.pdf",
      "url": "https://uvu.instructure.com/files/87935895/download?download_frd=1&verifier=Awg5WA1rTrQfKYWqmoK48j3TyZp2YXLDeU0U4PDZ",
      "folder": false,
      "lastUpdated": "2018-08-20T14:40:26Z",
      "size": 94905,
      "sync": true,
      "id": 87935895
    },
    {
      "name": "Chapter 0 CS 3320.pdf",
      "url": "https://uvu.instructure.com/files/89000659/download?download_frd=1&verifier=9c3FFuMVbvRKotgYya0YpLNNputU8tdqqcu0bKcs",
      "folder": false,
      "lastUpdated": "2018-08-23T17:23:49Z",
      "size": 1427004,
      "sync": true,
      "id": 89000659
    },
    {
      "name": "Contest021.pdf",
      "url": "https://uvu.instructure.com/files/89620882/download?download_frd=1&verifier=nTBpUvHytlNnJFkxRzSpUrdoS2XG8DjmM3KvvdvR",
      "folder": false,
      "lastUpdated": "2018-10-01T18:02:37Z",
      "size": 633577,
      "sync": true,
      "id": 89620882
    },
    {
      "name": "CS 3320 Exam I study guide Fall 2018.docx",
      "url": "https://uvu.instructure.com/files/89608499/download?download_frd=1&verifier=EN7y4tIrCSuOiClvI1IADMiFnlfo7OMjnjjxt7l1",
      "folder": false,
      "lastUpdated": "2018-09-27T16:10:43Z",
      "size": 12109,
      "sync": true,
      "id": 89608499
    },
    {
      "name": "CS3320 Quiz 6 KEY.docx",
      "url": "https://uvu.instructure.com/files/89676348/download?download_frd=1&verifier=dS7n4z0zpREoxXYZySzipe0PW1EASRyji7Nbsml2",
      "folder": false,
      "lastUpdated": "2018-10-03T16:29:32Z",
      "size": 689408,
      "sync": true,
      "id": 89676348
    },
    {
      "name": "CS3320registrationDetails.pdf",
      "url": "https://uvu.instructure.com/files/87935897/download?download_frd=1&verifier=g3Xv0ju52UGjt3kDWH23x5l7IrrDzSExO2Ip3Vzq",
      "folder": false,
      "lastUpdated": "2018-08-20T14:41:40Z",
      "size": 43771,
      "sync": true,
      "id": 87935897
    },
    {
      "name": "GaussianElimination.pdf",
      "url": "https://uvu.instructure.com/files/89474368/download?download_frd=1&verifier=1RWPDK5V1MMU1M2m2d535S6dQmafSvsctM6sBEQP",
      "folder": false,
      "lastUpdated": "2018-09-16T04:29:51Z",
      "size": 1222364,
      "sync": true,
      "id": 89474368
    },
    {
      "name": "IEEE revF2018.pdf",
      "url": "https://uvu.instructure.com/files/89000661/download?download_frd=1&verifier=nG28WZRANuptTpcBwkHRafUV7jbmBrT8K6tB6VSM",
      "folder": false,
      "lastUpdated": "2018-08-23T13:48:26Z",
      "size": 442529,
      "sync": true,
      "id": 89000661
    },
    {
      "name": "Interpolation.pptx",
      "url": "https://uvu.instructure.com/files/89634523/download?download_frd=1&verifier=M4e1UHsQAMcSJOJux6IGlVjDDtqeTm1R3N9pjpcr",
      "folder": false,
      "lastUpdated": "2018-09-29T19:52:36Z",
      "size": 1808169,
      "sync": true,
      "id": 89634523
    },
    {
      "name": "Iterative Methods.pdf",
      "url": "https://uvu.instructure.com/files/89519946/download?download_frd=1&verifier=enaORQzZPEE5phPaUusS3dF3A20D9b5lEsmht3gU",
      "folder": false,
      "lastUpdated": "2018-09-22T17:26:52Z",
      "size": 1178750,
      "sync": true,
      "id": 89519946
    },
    {
      "name": "LeastSquares.pdf",
      "url": "https://uvu.instructure.com/files/89710531/download?download_frd=1&verifier=6E1B6C6YJ50jZ0mkG0JlDVZSETklZBvv7Eh2PgdZ",
      "folder": false,
      "lastUpdated": "2018-10-06T23:58:36Z",
      "size": 3089882,
      "sync": true,
      "id": 89710531
    },
    {
      "name": "Matrix inverse and Condition rev 2018F.pdf",
      "url": "https://uvu.instructure.com/files/89474369/download?download_frd=1&verifier=ET6lrmhzLuothrJphuMyUjxZ4eLaksdI6Fzy6pCl",
      "folder": false,
      "lastUpdated": "2018-09-16T03:36:49Z",
      "size": 199831,
      "sync": true,
      "id": 89474369
    },
    {
      "name": "Newton Secant examples.docx",
      "url": "https://uvu.instructure.com/files/89282950/download?download_frd=1&verifier=AWScjpZSSPiMckG5Sw102xM51kYAoDobV8DmoGgD",
      "folder": false,
      "lastUpdated": "2018-09-04T20:18:38Z",
      "size": 35981,
      "sync": true,
      "id": 89282950
    },
    {
      "name": "NewtonMethodMatlab.pdf",
      "url": "https://uvu.instructure.com/files/89492350/download?download_frd=1&verifier=JdtiXvW9Bzhg7xHgKclDLnUydZ8n2OqQjfCfpTPJ",
      "folder": false,
      "lastUpdated": "2018-09-19T15:51:05Z",
      "size": 126440,
      "sync": true,
      "id": 89492350
    },
    {
      "name": "Open Methods 2018Fall.pptx",
      "url": "https://uvu.instructure.com/files/89282947/download?download_frd=1&verifier=F5CfHOTWGk9pvMLWHRET46uoSwYwQMgaWaJEufFK",
      "folder": false,
      "lastUpdated": "2018-09-06T20:04:28Z",
      "size": 430894,
      "sync": true,
      "id": 89282947
    },
    {
      "name": "Problem 2 Answers.pdf",
      "url": "https://uvu.instructure.com/files/89557771/download?download_frd=1&verifier=7ZaTcDeOXOdfw0wkt6FznhG5wR1qsXOcirVclvj0",
      "folder": false,
      "lastUpdated": "2018-09-22T22:06:59Z",
      "size": 32047,
      "sync": true,
      "id": 89557771
    },
    {
      "name": "sampleComputerProblem.pdf",
      "url": "https://uvu.instructure.com/files/89188291/download?download_frd=1&verifier=TdovMg7BQrAVd9jAdd6qtJ918lCqbZ90ceIp23dw",
      "folder": false,
      "lastUpdated": "2018-08-30T15:43:17Z",
      "size": 673218,
      "sync": true,
      "id": 89188291
    },
    {
      "name": "Taylor's Theorem - HMC Calculus Tutorial.pdf",
      "url": "https://uvu.instructure.com/files/87935896/download?download_frd=1&verifier=9zy0zzQgYVfLgm2Hf0jfS6VRnhai7AAX5BUpqreE",
      "folder": false,
      "lastUpdated": "2018-08-20T14:42:03Z",
      "size": 124681,
      "sync": true,
      "id": 87935896
    }
  ],
  "files_url": "https://uvu.instructure.com/api/v1/folders/3183075/files",
  "folders_url": "https://uvu.instructure.com/api/v1/folders/3183075/folders"
};

canvasIntegration.downloadCourse(networks).then((course) => {
  const jsonResults = JSON.stringify(course);
  fs.writeFile("./items.json", jsonResults, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  });    
});

// const jsonResults = JSON.stringify(course);
// fs.writeFile("./items.json", jsonResults, 'utf8', function (err) {
//   if (err) {
//       return console.log(err);
//   }
//   console.log("The file was saved!");
// });  

// const course = {"id":1,"name":"Example Course","account_id":3,"folders_url":"http://ec2-18-233-226-106.compute-1.amazonaws.com/api/v1/folders/1/folders","files_url":"http://ec2-18-233-226-106.compute-1.amazonaws.com/api/v1/folders/1/files","items":[]}

// getCourseItemsMap('MvYujAXDbZEodUwe1CarI42IRABT5p04yU9lJoerbGzjyrJRjzyxAC8NR8DqpeJs', course);