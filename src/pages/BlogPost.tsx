import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaCalendar, FaUser, FaClock, FaArrowLeft, FaShare } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useBlogData } from '@/hooks/useBlogData';
import { useToast } from '@/hooks/use-toast';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { posts, isLoading, error } = useBlogData();

  // Find the specific blog post
  const post = posts.find(p => p.id === id);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content: string | null) => {
    if (!content) return '1 min read';
    const words = content.split(' ').length;
    const readTime = Math.ceil(words / 200);
    return `${readTime} min read`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || 'Check out this blog post',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Blog post link has been copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-destructive mb-4">Article not found</p>
            <Button onClick={() => navigate('/blog')}>
              Back to Blog
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if post is published (for public access)
  if (post.status !== 'published') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">This article is not yet published</p>
            <Button onClick={() => navigate('/blog')}>
              Back to Blog
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <article className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/blog')}
              className="text-muted-foreground hover:text-primary"
            >
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Button>
          </motion.div>

          {/* Hero Image */}
          {post.image_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </motion.div>
          )}

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge className="bg-accent text-accent-foreground">
                {post.category || 'General'}
              </Badge>
              {post.featured && (
                <Badge variant="secondary">Featured</Badge>
              )}
            </div>

            <h1 className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl mb-6 text-primary">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center space-x-2">
                <FaUser className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendar className="w-4 h-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaClock className="w-4 h-4" />
                <span>{calculateReadTime(post.content)}</span>
              </div>
            </div>

            {post.excerpt && (
              <p className="text-lg text-muted-foreground mb-6 italic">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-muted-foreground hover:text-primary"
              >
                <FaShare className="mr-2" />
                Share
              </Button>
            </div>
          </motion.header>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="prose prose-lg max-w-none"
          >
            <div className="font-raleway text-foreground leading-relaxed">
              {post.content ? (
                post.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-6">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-muted-foreground">No content available.</p>
              )}
            </div>
          </motion.div>

          {/* Article Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Published on {formatDate(post.published_at)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-muted-foreground hover:text-primary"
              >
                <FaShare className="mr-2" />
                Share this article
              </Button>
            </div>
          </motion.footer>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;