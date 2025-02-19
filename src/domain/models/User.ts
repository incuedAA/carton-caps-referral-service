/** A mock user model for the application
 * Here we assume the user model, definined in the "user" service, is how it will be stored in the database, and the response body from the "user" service
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
  createdAt: Date;
  updatedAt: Date;
  referralCode: string;
}
