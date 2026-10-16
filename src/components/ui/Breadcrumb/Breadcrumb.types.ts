export interface BreadcrumbItem {
  label: string;
  // Ignored for the last item, which is the current page
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}
