import { NextFunction, Request, Response } from "express";
import * as subscriptionRepository from "../repositories/subscriptionRepository";
import webpush, { SendResult } from "web-push";

export const post = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const subscription = req.body;

    const newSubscription = await subscriptionRepository.create(subscription);
    console.log("New subscription added");
    // Send 201 - resource created
    res.status(201).json(newSubscription);
  } catch (e) {
    next(e);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const endpoint: string = req.query.endpoint?.toString();
    if (!endpoint) {
      res.sendStatus(400);
      return;
    }

    const successful = await subscriptionRepository.deleteByEndpoint(endpoint);
    if (successful) {
      res.sendStatus(200);
      console.log("Subscription removed");
    } else {
      res.sendStatus(500);
    }
  } catch (e) {
    next(e);
  }
};

export const broadcast = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notification = { title: "SHIPMENT (Ref#:00000)", body: "Ken Chan: @Ho Yeung Test", icon: "/swivel.jpg" };

    const subscriptions = await subscriptionRepository.getAll();

    const notifications: Promise<SendResult>[] = [];
    subscriptions.forEach((subscription) => {
      notifications.push(
        webpush.sendNotification(subscription, JSON.stringify(notification))
      );
    });

    await Promise.all(notifications);
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};
