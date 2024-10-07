# Node.js API Cluster with Rate Limiting and Queueing

## Overview

This project implements a Node.js API cluster with two replica sets, a rate-limiting mechanism, and a queueing system to manage tasks per user ID. The API ensures that:

- **1 task per second** and **7 tasks per minute** are processed per user ID.
- **No requests are dropped**; instead, they are queued and processed according to rate limits.
- Task completions are logged to a `task.log` file.

## Technologies Used

- **Node.js & Express.js**: For building the API server.
- **BullMQ**: For managing task queues.
- **Redis**: As a backend for Bull and for rate limiting.
- **PM2**: For clustering and process management.
- **Winston**: For logging task completions.

## Prerequisites

- **Node.js** (v12 or higher)
- **npm**
- **Redis** installed and running locally or accessible remotely.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/rahul-thakur-01/node-api-cluster.git
   cd node-api-cluster
   npm install
   npm install pm2 -g
   pm2 flush
   pm2 start ecosystem.config.json
   ./run_tasks.sh
   pm2 logs node-api-cluster
