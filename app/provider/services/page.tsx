'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, GripVertical } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  active: boolean;
}

const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Leak Repair',
    category: 'Maintenance Staff',
    price: 75,
    duration: '1-2 hours',
    description: 'Fix water leaks in pipes, faucets, and fixtures',
    active: true,
  },
  {
    id: '2',
    name: 'Pipe Replacement',
    category: 'Plumbing',
    price: 150,
    duration: '2-4 hours',
    description: 'Replace damaged or old pipes with new ones',
    active: true,
  },
  {
    id: '3',
    name: 'Facility Maintenance',
    category: 'Plumbing',
    price: 100,
    duration: '1-2 hours',
    description: 'General maintenance support for homes, shops, and malls',
    active: false,
  },
];

export default function ManageServicesPage() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    category: 'Plumbing',
    price: '',
    duration: '',
    description: '',
  });

  const handleAddService = () => {
    if (newService.name && newService.price) {
      setServices([
        ...services,
        {
          id: Date.now().toString(),
          ...newService,
          price: parseFloat(newService.price),
          active: true,
        },
      ]);
      setNewService({
        name: '',
        category: 'Plumbing',
        price: '',
        duration: '',
        description: '',
      });
      setShowAddForm(false);
    }
  };

  const handleToggleActive = (id: string) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8 flex items-center justify-between"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-bold text-foreground">Manage Services</h1>
            <p className="text-muted-foreground">Add and manage the services you offer</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </motion.div>
        </motion.div>

        {/* Add Service Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <Card className="p-6 border-border bg-primary/5 border-primary/30">
              <h2 className="text-lg font-semibold mb-4">Add New Service</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Service Name</label>
                    <Input
                      placeholder="e.g., Leak Repair"
                      value={newService.name}
                      onChange={(e) =>
                        setNewService({ ...newService, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={newService.category}
                      onChange={(e) =>
                        setNewService({ ...newService, category: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                    >
                      <option>Plumbing</option>
                      <option>Electrician</option>
                      <option>Carpentry</option>
                      <option>Tailor</option>
                      <option>Maintenance Staff</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price ($)</label>
                    <Input
                      type="number"
                      placeholder="75"
                      value={newService.price}
                      onChange={(e) =>
                        setNewService({ ...newService, price: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration</label>
                    <Input
                      placeholder="1-2 hours"
                      value={newService.duration}
                      onChange={(e) =>
                        setNewService({ ...newService, duration: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="w-full min-h-20 px-4 py-2 rounded-lg border border-border bg-background"
                    placeholder="Describe this service..."
                    value={newService.description}
                    onChange={(e) =>
                      setNewService({ ...newService, description: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAddService}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Add Service
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-border"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Services List */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {services.length === 0 ? (
            <motion.div variants={itemVariants}>
              <Card className="p-12 text-center border-border">
                <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No services yet</h3>
                <p className="text-muted-foreground mb-6">
                  Add your first service to start receiving bookings
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Add Service
                </Button>
              </Card>
            </motion.div>
          ) : (
            services.map((service, index) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 hover:shadow-lg transition-all border-2 ${
                    service.active
                      ? 'border-border'
                      : 'border-muted opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <GripVertical className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {service.name}
                          </h3>
                          <Badge className="bg-primary/10 text-primary">
                            {service.category}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground mb-3">
                          {service.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Price: </span>
                            <span className="font-semibold text-foreground">
                              ${service.price}/hr
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration: </span>
                            <span className="font-semibold text-foreground">
                              {service.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={() => handleToggleActive(service.id)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        {service.active ? (
                          <ToggleRight className="h-6 w-6 text-accent" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                        )}
                      </button>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </main>
  );
}
