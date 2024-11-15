import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z
    .string()
    .min(5, { message: "Message must be at least 5 characters." }),
});

export default function ContactForm() {
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      await emailjs.send(
        "service_cncxx1f", // Replace with your EmailJS Service ID
        "template_2aoi8q2", // Replace with your EmailJS Template ID
        {
          name: data.name,
          email: data.email,
          message: data.message,
        },
        "ILikWlrTFc3Lt3f6y" // Replace with your EmailJS Public Key
      );
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email.");
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
        Contact Us
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-md mx-auto space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Your message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </Form>
    </div>
  );
}
