"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Section } from "../shared/Section";

const contactSchema = z.object({
  name: z.string().min(2, { message: "이름은 2글자 이상이어야 합니다." }),
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  message: z
    .string()
    .min(10, { message: "메시지는 10글자 이상이어야 합니다." }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section
      id="contact"
      subtitle="Connect"
      title="Start a Conversation"
      className="py-32"
    >
      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-black text-white p-8 md:p-12 rounded-3xl overflow-hidden relative"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-32 -mt-32 rounded-full" />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 relative z-10"
          >
            <div className="space-y-2">
              <label
                htmlFor="contact-name"
                className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40"
              >
                Name
              </label>
              <input
                id="contact-name"
                {...register("name")}
                placeholder="Your name"
                className="w-full bg-transparent border-b border-white/10 py-4 focus:border-white outline-none transition-colors text-xl font-light placeholder:text-white/10"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contact-email"
                className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40"
              >
                Email
              </label>
              <input
                id="contact-email"
                {...register("email")}
                placeholder="your@email.com"
                className="w-full bg-transparent border-b border-white/10 py-4 focus:border-white outline-none transition-colors text-xl font-light placeholder:text-white/10"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contact-message"
                className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                {...register("message")}
                placeholder="Describe your vision"
                rows={4}
                className="w-full bg-transparent border-b border-white/10 py-4 focus:border-white outline-none transition-colors text-xl font-light placeholder:text-white/10 resize-none"
              />
              {errors.message && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex items-center gap-4 text-xl font-black uppercase tracking-tighter italic hover:gap-6 transition-all disabled:opacity-50 disabled:gap-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <AnimatePresence>
            {submitStatus !== "idle" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-20 backdrop-blur-xl ${
                  submitStatus === "success" ? "bg-black/95" : "bg-red-950/95"
                }`}
              >
                {submitStatus === "success" ? (
                  <>
                    <CheckCircle2 className="w-16 h-16 text-white mb-6" />
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-4">
                      Message Sent
                    </h3>
                    <p className="text-white/60 font-light mb-8">
                      감사합니다. 메시지가 안전하게 전달되었습니다.
                      <br />곧 연락드리겠습니다.
                    </p>
                    <button
                      onClick={() => setSubmitStatus("idle")}
                      className="text-[10px] uppercase tracking-[0.3em] font-bold border border-white/20 px-8 py-3 hover:bg-white hover:text-black transition-colors"
                    >
                      Back to form
                    </button>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-16 h-16 text-white mb-6" />
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-4">
                      Submission Failed
                    </h3>
                    <p className="text-white/60 font-light mb-8">
                      문제가 발생했습니다. 다시 시도해 주세요.
                    </p>
                    <button
                      onClick={() => setSubmitStatus("idle")}
                      className="text-[10px] uppercase tracking-[0.3em] font-bold border border-white/20 px-8 py-3 hover:bg-white hover:text-black transition-colors"
                    >
                      Try again
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  );
}
