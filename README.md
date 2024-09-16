
# Cloud Data Upload

The ultimate Next.js app for effortless cloud data management. Create projects, upload files securely with AWS, and enjoy advanced features like AI-driven image processing. Elevate your cloud experience where innovation meets efficiency.
## API Reference ( Examples Routes Only )

#### API to fetch AWS s3 presigned url of object

```http
  POST /api/gets3Object
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | **Required**. Auth.js userId |
| `projectName` | `string` | **Required**. Project Name|
| `folderName` | `string` | **Required**. Folder Name|
| `fileName` | `string` | **Required**. File Name|
| `type` | `string` | **Required**. Content Type of File|

#### API to generate AI images based on DeepAI api routes

```http
  POST /api/generateImage
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `textPrompt` | `string` | **Required**. Authenticated User Only |


```http
  POST /api/generateImage
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `textPrompt` | `string` | **Required**. Authenticated User Only |

#### API route to detect user emotions index (sad,dull,etc) based on live photo

```http
  GET /api/handleEmotions
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `imageUrl`      | `string` | **Required**. Authenticated User Only |




## Appendix

- **Authentication and Security**: Utilizes Auth.js to ensure robust security and user authentication.
- **Cloud Storage**: Integrates AWS for reliable and scalable storage solutions.
- **AI Image Generation**: Leverages DeepAI for advanced AI-driven image generation capabilities.
- **Emotion Detection**: Employs Luxand to detect and analyze the user's current emotions.
- **Scalable Architecture**: Designed with a high-scalability architecture to handle growing user demands efficiently.
- **Next.js 14**: Built using the latest version of Next.js (Next.js 14) for optimal performance and modern features.
- **User Interface**: Features a clean and minimalist UI for an enhanced user experience.
- **Unlimited Projects and Storage**: Supports unlimited projects and storage, ensuring flexibility and growth potential.
## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/GPL-3.0)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

This project is open source and available under multiple licenses. Feel free to use it under the terms of the MIT, GPLv3, or AGPL licenses.

## Acknowledgements

 - GCES IT EXPO😃 
 - All the future opensource committers😃 

