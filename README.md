# README

## Overview
This project is a NestJS-based API that provides functionalities for managing blog posts and comments. The API includes features such as creating, updating, deleting, and retrieving posts, as well as adding comments, replying to comments, voting on posts and comments, and implementing caching to improve performance. The repository design pattern was utilized to separate concerns and ensure a clean architecture.

## Approach

### Project Setup
Initialized a new NestJS project and added necessary dependencies such as Mongoose for MongoDB interactions, Cloudinary for image uploads, and NodeCache for caching.

### Repository Design Pattern
Implemented the repository design pattern to handle data persistence. This ensures a clear separation of concerns, making the codebase more maintainable and testable.

### CRUD Operations for Posts
Developed CRUD endpoints for posts including features to create, update, delete, and retrieve posts. Incorporated Cloudinary for handling image uploads.

### Comments and Replies
Added functionalities for users to comment on posts and reply to comments. Each comment and reply includes user information and timestamps.

### Voting System
Implemented endpoints for upvoting and downvoting posts and comments, which dynamically update the counts.

### Caching
Integrated NodeCache to cache responses for retrieving posts and comments, reducing the load on the database and improving response times.

### Swagger Integration
Used Swagger for API documentation, allowing for easy testing and understanding of the available endpoints.

### View Count Increment
Implemented logic to increment the view count each time a post is retrieved by its ID.

## Challenges and Solutions

### Caching Complexity
Managing cache invalidation was challenging, especially when posts or comments were updated or deleted. Solved this by strategically deleting related cache entries upon updates or deletions.

### Aggregation Pipelines
Constructing complex MongoDB aggregation pipelines to retrieve posts along with comments and replies was intricate. This was tackled by iterative testing and leveraging MongoDB's powerful aggregation framework.

### Swagger Documentation
Ensuring comprehensive and accurate Swagger documentation required careful attention to detail. This was addressed by using decorators provided by NestJS's Swagger module.

## Local Swagger Link
You can access the local Swagger documentation at: http://localhost:4000/api/docs#

